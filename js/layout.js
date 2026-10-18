function initLayout(activePage, title = 'OpoTest', backUrl = null) {
  const header = document.getElementById('appHeader')
  if (header) {
    const isDark = document.documentElement.classList.contains('dark')
    header.innerHTML = `
      <div class="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-2 min-w-[70px]">
          ${backUrl
            ? `<a href="${backUrl}" class="flex items-center gap-1.5 min-h-[44px] px-2 -ml-2 rounded-xl text-indigo-600 dark:text-indigo-400 active:bg-indigo-50 dark:active:bg-indigo-900/30 transition-colors font-semibold text-sm">
                 <span class="text-lg">&lt;</span><span>Atras</span>
               </a>`
            : `<a href="./dashboard.html" class="font-bold text-indigo-600 dark:text-indigo-400 text-lg tracking-tight">OpoTest</a>`
          }
        </div>
        ${backUrl ? `<h1 class="text-base font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">${title}</h1>` : ''}
        <div class="flex items-center gap-1 min-w-[60px] justify-end">
          <button id="themeBtn" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-min" title="Cambiar tema">
            ${isDark ? 'Claro' : 'Oscuro'}
          </button>
          <button id="logoutBtn" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-min" title="Cerrar sesion">
            Salir
          </button>
        </div>
      </div>`
    header.className = 'sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700'

    const themeBtn = document.getElementById('themeBtn')
    if (themeBtn) themeBtn.addEventListener('click', () => {
      if (typeof toggleTheme === 'function') toggleTheme()
    })

    const logoutBtn = document.getElementById('logoutBtn')
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      if (typeof logout === 'function') logout()
    })
  }

  const nav = document.getElementById('bottomNav')
  if (nav) {
    const items = [
      { page: 'dashboard', href: './dashboard.html', label: 'Inicio' },
      { page: 'temas', href: './temas.html?v=20261018-1', label: 'Temas' },
      { page: 'importar', href: './importar.html', label: 'Importar' },
      { page: 'estadisticas', href: './estadisticas.html', label: 'Stats' },
      { page: 'falladas', href: './falladas.html', label: 'Falladas' },
    ]

    nav.innerHTML = items.map(it => `
      <a href="${it.href}" data-page="${it.page}"
         class="nav-item flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors
                ${it.page === activePage ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}">
        <span class="text-[11px] font-medium leading-none">${it.label}</span>
      </a>`).join('')
    nav.className = 'fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 safe-bottom'
    nav.style.display = 'flex'
  }
}
