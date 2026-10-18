function extraerCodigo(nombreArchivo) {
  return nombreArchivo.replace(/\.txt$/i, '').split('_')[0].toUpperCase()
}

function parsearTxt(contenido) {
  const texto = contenido.replace(/^\uFEFF/, '')
  const exportado = /^\s*"numero"\s*\|/i.test(texto)
  let lineas
  if (exportado) {
    if (typeof XLSX === 'undefined') throw new Error('No se ha cargado la biblioteca necesaria para leer este TXT. Recarga la pagina.')
    const libro = XLSX.read(texto, { type: 'string', FS: '|', raw: true })
    lineas = XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]], { header: 1, defval: '', raw: true, blankrows: true })
  } else {
    lineas = texto.split('\n')
  }
  const preguntas = []
  const errores = []
  const codigos = new Set()
  let inicio = exportado ? 1 : 0
  if (!exportado) {
    const primera = lineas.findIndex(linea => linea.trim())
    if (primera >= 0) {
      const campos = lineas[primera].split('|')
      if (campos.length >= 7 && /^(id|n[uú]mero|n[º°.]?)$/i.test(campos[0].trim())) inicio = primera + 1
    }
  }

  for (let i = inicio; i < lineas.length; i++) {
    const linea = lineas[i]
    if (exportado ? linea.every(valor => !String(valor).trim()) : !linea.trim()) continue

    const partes = exportado ? linea.map(valor => String(valor)) : linea.split('|').map(p => p.trim())
    if (partes.length < 7) {
      errores.push(`Linea ${i + 1}: formato incorrecto (${partes.length} campos)`)
      continue
    }

    const [numStr, pregunta, a, b, c, d, correctaRaw, ...explParts] = partes
    const numero = parseInt(numStr, 10)

    if (!/^\d+$/.test(numStr.trim()) || !Number.isSafeInteger(numero) || numero < 1) {
      errores.push(`Linea ${i + 1}: numero invalido "${numStr}"`)
      continue
    }
    if (![pregunta, a, b, c, d].every(valor => valor?.trim())) {
      errores.push(`Linea ${i + 1}: faltan campos`)
      continue
    }

    const correcta = correctaRaw.trim().toLowerCase()
    if (!['a', 'b', 'c', 'd'].includes(correcta)) {
      errores.push(`Linea ${i + 1}: respuesta invalida "${correctaRaw}"`)
      continue
    }

    preguntas.push({
      numero,
      pregunta,
      opcion_a: a,
      opcion_b: b,
      opcion_c: c,
      opcion_d: d,
      respuesta_correcta: correcta,
      explicacion: exportado ? (explParts[0] || '') : explParts.join('|').trim(),
    })
    if (exportado && partes[8]?.trim()) codigos.add(partes[8].trim().toUpperCase())
  }

  if (codigos.size > 1) return { preguntas: [], errores: [...errores, 'El archivo mezcla preguntas de distintos temas.'], codigoTema: '' }
  return { preguntas, errores, codigoTema: [...codigos][0] || '' }
}

function leerArchivo(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = e => resolve(e.target.result)
    r.onerror = () => reject(new Error(`Error al leer ${file.name}`))
    r.readAsText(file, 'utf-8')
  })
}
