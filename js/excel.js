// Parsea un Excel de temas usando SheetJS (cargado via CDN como XLSX global)
// Columnas esperadas: grupo | codigo | tema
async function parsearExcelTemas(file) {
  const buffer   = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const hoja     = workbook.Sheets[workbook.SheetNames[0]]
  const filas    = XLSX.utils.sheet_to_json(hoja, { defval: '', raw: false })

  const temas   = []
  const errores = []

  const buscar = (fila, nombres) =>
    nombres.reduce((v, n) => v || (fila[n] ? String(fila[n]).trim() : ''), '')

  filas.forEach((fila, idx) => {
    const num    = idx + 2
    const grupo  = buscar(fila, ['grupo','Grupo','GRUPO'])
    const codigo = buscar(fila, ['codigo','Código','código','CODIGO'])
    const tema   = buscar(fila, ['tema','Tema','TEMA','nombre','Nombre'])

    if (!grupo)  { errores.push(`Fila ${num}: falta "grupo"`);  return }
    if (!codigo) { errores.push(`Fila ${num}: falta "codigo"`); return }
    if (!tema)   { errores.push(`Fila ${num}: falta "tema"`);   return }

    temas.push({ grupo, codigo: codigo.toUpperCase(), tema })
  })

  return { temas, errores }
}
