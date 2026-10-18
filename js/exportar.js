async function leerFilasExportacion(tabla, columnas, filtrar = query => query, signal, progreso = () => {}) {
  const filas = []
  let ultimoId = null
  while (true) {
    signal?.throwIfAborted()
    let query = filtrar(db.from(tabla).select(columnas)).order('id').limit(500)
    if (ultimoId) query = query.gt('id', ultimoId)
    if (signal) query = query.abortSignal(signal)
    const { data, error } = await conTiempoLimite(query, 20000, 'La descarga de datos ha tardado demasiado. Vuelve a intentarlo.')
    if (error) throw error
    if (!data?.length) break
    filas.push(...data)
    ultimoId = data[data.length - 1].id
    progreso(filas.length)
  }
  return filas
}

function crearExcelTemario(temas) {
  const rows = [['grupo', 'codigo', 'tema'], ...temas.map(t => [t.grupo, t.codigo, t.tema])]
  const hoja = XLSX.utils.aoa_to_sheet(rows)
  hoja['!cols'] = [{ wch: 24 }, { wch: 16 }, { wch: 100 }]
  hoja['!autofilter'] = { ref: hoja['!ref'] }
  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Temario')
  return XLSX.write(libro, { bookType: 'xlsx', type: 'array' })
}

function crearTxtTema(tema, preguntas) {
  const campos = ['pregunta', 'opcion_a', 'opcion_b', 'opcion_c', 'opcion_d']
  const rows = [['numero', 'pregunta', 'a', 'b', 'c', 'd', 'correcta', 'explicacion', 'codigo_tema']]
  preguntas.forEach((p, index) => {
    if (campos.some(campo => !String(p[campo] ?? '').trim()) || !['a', 'b', 'c', 'd'].includes(p.respuesta_correcta)) {
      throw new Error(`El tema ${tema.codigo} tiene una pregunta incompleta (${p.id}). Corrigela antes de exportar.`)
    }
    rows.push([index + 1, ...campos.map(campo => String(p[campo])), p.respuesta_correcta, p.explicacion || '', tema.codigo])
  })
  // El formato delimitado con comillas conserva barras, comillas y saltos de linea.
  return '\uFEFF' + XLSX.utils.sheet_to_csv(XLSX.utils.aoa_to_sheet(rows), { FS: '|', RS: '\r\n', forceQuotes: true, blankrows: false })
}

function nombreTxtTema(tema) {
  const limpiar = valor => String(valor).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
  const codigo = limpiar(tema.codigo).slice(0, 64) || 'TEMA'
  const titulo = limpiar(tema.tema).slice(0, 80) || 'preguntas'
  return `${codigo}_${titulo}.txt`
}

async function obtenerPreguntasExportacion(temas, incluirEliminadas, signal, progreso = () => {}) {
  const columnas = 'id,tema_id,codigo_tema,pregunta,opcion_a,opcion_b,opcion_c,opcion_d,respuesta_correcta,explicacion,activa,eliminada,created_at'
  const porId = new Map(temas.map(t => [t.id, t]))
  const porCodigo = new Map(temas.map(t => [t.codigo, t]))
  const preguntas = new Map()
  let registrosLeidos = 0
  const consultas = [['tema_id', [...porId.keys()]], ['codigo_tema', [...porCodigo.keys()]]]
  for (const [campo, valores] of consultas) {
    for (let i = 0; i < valores.length; i += 50) {
      const lote = valores.slice(i, i + 50)
      const inicio = registrosLeidos
      const filas = await leerFilasExportacion('preguntas', columnas, query => {
        query = query.in(campo, lote)
        return incluirEliminadas ? query : query.eq('activa', true).eq('eliminada', false)
      }, signal, cantidad => progreso(inicio + cantidad))
      registrosLeidos += filas.length
      filas.forEach(p => preguntas.set(p.id, p))
    }
  }
  const agrupadas = new Map(temas.map(t => [t.id, []]))
  preguntas.forEach(p => {
    const tema = porId.get(p.tema_id) || porCodigo.get(p.codigo_tema)
    if (tema) agrupadas.get(tema.id).push(p)
  })
  agrupadas.forEach(lista => lista.sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')) || a.id.localeCompare(b.id)))
  progreso(registrosLeidos)
  return agrupadas
}

async function crearZipPreguntas(temas, agrupadas, signal, progreso = () => {}) {
  const zip = new JSZip()
  const nombres = new Set()
  temas.forEach(t => {
    const preguntas = agrupadas.get(t.id) || []
    if (!preguntas.length) return
    let nombre = nombreTxtTema(t)
    if (nombres.has(nombre.toLowerCase())) nombre = nombre.replace(/\.txt$/, `_${t.id}.txt`)
    nombres.add(nombre.toLowerCase())
    zip.file(nombre, crearTxtTema(t, preguntas))
  })
  signal?.throwIfAborted()
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }, meta => {
    signal?.throwIfAborted()
    progreso(meta.percent)
  })
}

function descargarExportacion(contenido, nombre, tipo) {
  const blob = contenido instanceof Blob ? contenido : new Blob([contenido], { type: tipo })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
