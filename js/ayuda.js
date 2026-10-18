;(() => {
  let dialogo
  let cargaPrompt = null
  let textoPrompt = ''
  let overflowAnterior = ''
  let scrollBloqueado = false

  function crearVentana() {
    if (dialogo) return
    const style = document.createElement('style')
    style.textContent = `
      #ayudaDialog { width: min(58rem, calc(100% - 1.5rem)); max-height: calc(100dvh - 1.5rem); margin: auto; padding: 0; overflow: hidden; }
      #ayudaDialog::backdrop { background: rgb(0 0 0 / .55); }
      #ayudaDialog .ayuda-shell { display: flex; flex-direction: column; max-height: calc(100dvh - 1.5rem - 2px); }
      #ayudaDialog .ayuda-scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
      #ayudaDialog details > summary { cursor: pointer; padding: .8rem 0; font-weight: 600; }
      #ayudaDialog details + details { border-top: 1px solid rgb(148 163 184 / .25); }
      #ayudaDialog details > div { padding-bottom: 1rem; }
      #ayudaDialog p, #ayudaDialog li { overflow-wrap: anywhere; }
      #ayudaPrompt { width: 100%; height: 22rem; min-height: 10rem; max-height: 50dvh; white-space: pre-wrap; resize: vertical; line-height: 1.5; }
    `
    document.head.appendChild(style)
    dialogo = document.createElement('dialog')
    dialogo.id = 'ayudaDialog'
    dialogo.setAttribute('aria-labelledby', 'ayudaTitulo')
    dialogo.className = 'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl'
    dialogo.innerHTML = `
      <div class="ayuda-shell">
        <header class="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 id="ayudaTitulo" class="text-lg font-semibold">Ayuda de OpoTest</h2>
          <button id="ayudaCerrar" type="button" class="shrink-0 min-h-[44px] px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium">Cerrar</button>
        </header>
        <div role="tablist" aria-label="Secciones de ayuda" class="shrink-0 flex gap-1 px-4 sm:px-6 pt-3 border-b border-gray-200 dark:border-gray-700">
          <button id="ayudaTabUso" type="button" role="tab" aria-controls="ayudaUso" class="min-h-[44px] px-3 text-sm font-semibold border-b-2">Uso de la web</button>
          <button id="ayudaTabGenerar" type="button" role="tab" aria-controls="ayudaGenerar" class="min-h-[44px] px-3 text-sm font-semibold border-b-2">Generar preguntas</button>
        </div>
        <div class="ayuda-scroll px-4 sm:px-6 py-4">
          <section id="ayudaUso" role="tabpanel" aria-labelledby="ayudaTabUso" class="text-sm leading-relaxed">
            <details open>
              <summary>1. Empezar y preparar el temario</summary>
              <div class="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Accede desde la dirección publicada de tu web e inicia sesión con tu correo y contraseña. Si acabas de registrarte, confirma el correo cuando se solicite.</p>
                <p>En <strong>Temas</strong>, pulsa <strong>Nuevo tema</strong> e indica grupo, código único y nombre. El grupo permite organizar y filtrar el temario.</p>
                <p>El lápiz permite editar el nombre y el grupo. El código se conserva porque identifica las preguntas y sus archivos.</p>
                <p><strong>Eliminar</strong>, en la columna de un tema, marca sus preguntas como eliminadas. <strong>Eliminar tema</strong>, dentro del editor, solo elimina temas sin preguntas asociadas, incluidas las inactivas o eliminadas.</p>
              </div>
            </details>
            <details>
              <summary>2. Importar temas y preguntas</summary>
              <div class="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Para cargar varios temas, usa <strong>Importar → Excel de temas</strong>. El Excel debe tener las columnas <code>grupo</code>, <code>codigo</code> y <code>tema</code>. Los códigos que ya existen no se duplican.</p>
                <p>Crea los temas antes de importar preguntas. En <strong>Importar → TXT preguntas</strong>, selecciona uno o varios archivos y pulsa <strong>Importar preguntas</strong>.</p>
                <p>Usa un archivo por tema. Su nombre comienza por el código, seguido de un guion bajo: <code>C001_nombre-del-tema.txt</code>.</p>
                <p>Cada pregunta del TXT generado con IA ocupa una línea: número, enunciado, opciones A, B, C y D, letra correcta y explicación, separados por <code>|</code>. Puede ir sin cabecera; también se admiten las cabeceras habituales y los TXT exportados por la app.</p>
                <p>Revisa el resumen final de preguntas nuevas, duplicadas y errores. Las preguntas repetidas con el mismo contenido y código no vuelven a añadirse.</p>
              </div>
            </details>
            <details>
              <summary>3. Configurar y realizar un test</summary>
              <div class="space-y-2 text-gray-700 dark:text-gray-300">
                <p>En <strong>Inicio → Empezar test</strong>, elige 20, 40, 60 o todas las preguntas disponibles y selecciona los temas. Puedes filtrar por grupo y usar <strong>Seleccionar todo</strong> sobre el grupo visible.</p>
                <p>El botón <strong>Test</strong> de un tema abre la configuración con ese tema seleccionado y su grupo filtrado. La opción <strong>Incluir preguntas eliminadas</strong> permite practicar también esas preguntas.</p>
                <p>La selección de preguntas es aleatoria. Las posiciones de las respuestas también se mezclan, manteniendo la corrección vinculada al contenido.</p>
                <p>Al responder se indica si has acertado y se muestra la explicación disponible. Pulsa <strong>Siguiente</strong> o <strong>Terminar test</strong> después de la última pregunta.</p>
                <p><strong>Salir y continuar luego</strong> conserva el test en ese navegador y dispositivo. Reanúdalo desde <strong>Inicio → Test en progreso</strong>; el orden de las respuestas se mantiene. Cambiar de navegador, dispositivo o dirección web no traslada esa sesión local.</p>
                <p><strong>Marcar como no pertinente</strong> omite la pregunta del test y la marca como eliminada para futuras prácticas.</p>
              </div>
            </details>
            <details>
              <summary>4. Resultados, estadísticas y repaso</summary>
              <div class="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Al terminar se guardan los resultados. Puedes revisar las preguntas falladas, acertadas o todas y desplegar sus alternativas y explicaciones.</p>
                <p><strong>Stats</strong> muestra el historial y los resultados de los tests. <strong>Falladas</strong> ordena las preguntas con historial desde la menor tasa de acierto; permite filtrar por tema y practicar las seleccionadas.</p>
              </div>
            </details>
            <details>
              <summary>5. Exportar el contenido</summary>
              <div class="space-y-2 text-gray-700 dark:text-gray-300">
                <p>En <strong>Exportar</strong>, descarga el temario completo en Excel con las columnas necesarias para volver a importarlo.</p>
                <p>Selecciona un tema para descargar sus preguntas en TXT, o varios temas para obtener un ZIP con un TXT por tema con preguntas. Puedes elegir un grupo e incluir las preguntas eliminadas e inactivas.</p>
                <p>Las alternativas y la letra correcta se exportan en su orden original. Los archivos conservan acentos, comillas y saltos de línea y pueden reimportarse con la app actualizada.</p>
                <p>El TXT no conserva las marcas de pregunta eliminada o inactiva: las preguntas nuevas reimportadas se incorporan como disponibles. Los temas sin preguntas se incluyen en el Excel y no generan un TXT vacío.</p>
              </div>
            </details>
            <details>
              <summary>6. Si algo no carga</summary>
              <div class="space-y-2 text-gray-700 dark:text-gray-300">
                <p>Recarga la página y comprueba tu conexión. Tras una actualización, usa una recarga completa; en un ordenador puedes pulsar <strong>Ctrl+F5</strong>.</p>
                <p>Abre <strong>Inicio → Diagnóstico</strong> para comprobar la sesión, la lectura de las tablas y los recuentos. Las comprobaciones no modifican las preguntas ni los resultados.</p>
                <p>Si falta la sesión local de un test, vuelve a configurarlo en el mismo navegador donde vayas a realizarlo. Si se ha cerrado la sesión de acceso, inicia sesión de nuevo.</p>
              </div>
            </details>
          </section>
          <section id="ayudaGenerar" role="tabpanel" aria-labelledby="ayudaTabGenerar" class="hidden space-y-4 text-sm leading-relaxed">
            <h3 class="text-base font-semibold">Generar preguntas con una IA</h3>
            <ol class="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Crea el tema en la app y anota su código.</li>
              <li>Copia el prompt y pégalo en la IA que utilices. Adjunta la documentación de un solo tema: PDF, Word, normativa o apuntes.</li>
              <li>Indica el nombre del archivo, por ejemplo <code>C001_nombre-del-tema.txt</code>. El prompt solicita 100 preguntas de nivel medio-alto; puedes adaptar esos valores al pegarlo.</li>
              <li>Revisa las preguntas y sus respuestas contrastándolas con la documentación. Comprueba que la IA entregue el archivo completo, con la cantidad y el formato solicitados.</li>
              <li>Descarga el TXT en UTF-8 y súbelo desde <strong>Importar → TXT preguntas</strong>. Comprueba el resumen de importación.</li>
            </ol>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <label for="ayudaPrompt" class="font-semibold">Prompt para copiar</label>
              <div class="flex flex-wrap gap-2">
                <button id="ayudaReintentar" type="button" class="hidden min-h-[40px] px-3 border border-gray-300 dark:border-gray-600 rounded-lg">Reintentar</button>
                <button id="ayudaCopiar" type="button" disabled class="min-h-[40px] px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-40">Copiar prompt</button>
              </div>
            </div>
            <p id="ayudaEstado" role="status" aria-live="polite" class="min-h-[24px] text-gray-600 dark:text-gray-300"></p>
            <textarea id="ayudaPrompt" readonly spellcheck="false" class="block rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3" aria-describedby="ayudaEstado"></textarea>
          </section>
        </div>
      </div>`
    document.body.appendChild(dialogo)
    document.getElementById('ayudaCerrar').addEventListener('click', () => dialogo.close())
    dialogo.addEventListener('close', () => {
      if (!dialogo.open) {
        document.body.style.overflow = overflowAnterior
        scrollBloqueado = false
      }
    })
    dialogo.addEventListener('click', event => {
      const rect = dialogo.getBoundingClientRect()
      if (event.target === dialogo && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialogo.close()
    })
    document.getElementById('ayudaTabUso').addEventListener('click', () => seleccionarSeccion('uso'))
    document.getElementById('ayudaTabGenerar').addEventListener('click', () => seleccionarSeccion('generar'))
    dialogo.querySelector('[role="tablist"]').addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const generar = event.key === 'End' || (event.key !== 'Home' && event.target.id === 'ayudaTabUso')
      seleccionarSeccion(generar ? 'generar' : 'uso')
      document.getElementById(generar ? 'ayudaTabGenerar' : 'ayudaTabUso').focus()
    })
    document.getElementById('ayudaCopiar').addEventListener('click', copiarPrompt)
    document.getElementById('ayudaReintentar').addEventListener('click', cargarPrompt)
  }

  function seleccionarSeccion(seccion) {
    const generar = seccion === 'generar'
    ;[['ayudaTabUso', !generar], ['ayudaTabGenerar', generar]].forEach(([id, activo]) => {
      const button = document.getElementById(id)
      button.setAttribute('aria-selected', String(activo))
      button.tabIndex = activo ? 0 : -1
      button.classList.toggle('border-indigo-600', activo)
      button.classList.toggle('text-indigo-600', activo)
      button.classList.toggle('dark:text-indigo-400', activo)
      button.classList.toggle('dark:border-indigo-400', activo)
      button.classList.toggle('border-transparent', !activo)
    })
    document.getElementById('ayudaUso').classList.toggle('hidden', generar)
    document.getElementById('ayudaGenerar').classList.toggle('hidden', !generar)
    dialogo.querySelector('.ayuda-scroll').scrollTop = 0
    if (generar) cargarPrompt()
  }

  async function cargarPrompt() {
    if (textoPrompt) return
    if (cargaPrompt) return cargaPrompt
    const estado = document.getElementById('ayudaEstado')
    estado.textContent = 'Cargando prompt...'
    document.getElementById('ayudaReintentar').classList.add('hidden')
    cargaPrompt = (async () => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 15000)
      try {
        const response = await fetch(new URL('./ayuda/prompt-generar-preguntas.txt', window.location.href), { signal: controller.signal })
        if (!response.ok) throw new Error('No se ha podido cargar el prompt.')
        const texto = await response.text()
        if (!texto.trim() || /^\s*</.test(texto)) throw new Error('El archivo del prompt no está disponible.')
        textoPrompt = texto
        document.getElementById('ayudaPrompt').value = texto
        document.getElementById('ayudaCopiar').disabled = false
        estado.textContent = 'Prompt listo para copiar.'
      } catch (error) {
        estado.textContent = 'No se ha podido cargar el prompt. Comprueba la conexión y pulsa Reintentar.'
        document.getElementById('ayudaReintentar').classList.remove('hidden')
      } finally {
        clearTimeout(timer)
        cargaPrompt = null
      }
    })()
    return cargaPrompt
  }

  async function copiarPrompt() {
    if (!textoPrompt) return
    const button = document.getElementById('ayudaCopiar')
    const estado = document.getElementById('ayudaEstado')
    button.disabled = true
    try {
      let copiado = false
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(textoPrompt)
          copiado = true
        }
      } catch (error) { /* Se ofrece la seleccion manual si el navegador bloquea el portapapeles. */ }
      if (!copiado) {
        const area = document.getElementById('ayudaPrompt')
        area.focus()
        area.select()
        area.setSelectionRange(0, area.value.length)
        try { copiado = document.execCommand('copy') } catch (error) { copiado = false }
      }
      estado.textContent = copiado ? 'Prompt copiado. Ya puedes pegarlo en tu IA.' : 'El texto está seleccionado. Usa la opción Copiar de tu navegador o pulsa Ctrl+C.'
      if (copiado) button.focus()
    } finally {
      button.disabled = false
    }
  }

  window.mostrarAyuda = (seccion = 'uso') => {
    crearVentana()
    if (!dialogo.open) {
      if (!scrollBloqueado) overflowAnterior = document.body.style.overflow
      scrollBloqueado = true
      document.body.style.overflow = 'hidden'
      dialogo.showModal()
    }
    seleccionarSeccion(seccion)
  }
})()
