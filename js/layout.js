// Inyecta el header y la barra de navegación inferior en cada página.
// Llamar a initLayout(activePage, title, backUrl) al cargar la página.

function initLayout(activePage, title = 'OpoTest', backUrl = null) {
  // ── Header ──────────────────────────────────────────
  const header = document.getElementById('appHeader')
  if (header) {
    const isDark = document.documentElement.classList.contains('dark')
    header.innerHTML = `
      <div class="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
        <div class="flex items-center gap-2 min-w-[60px]">
          ${backUrl
            ? `<a href="${backUrl}" class="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium">
                 <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                 </svg>Atrás
               </a>`
            : `<a href="./dashboard.html" class="font-bold text-indigo-600 dark:text-indigo-400 text-lg tracking-tight">📚 OpoTest</a>`
          }
        </div>
        ${backUrl ? `<h1 class="text-base font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">${title}</h1>` : ''}
        <div class="flex items-center gap-1 min-w-[60px] justify-end">
          <button id="themeBtn" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-min" title="Cambiar tema">
            ${isDark ? '☀️' : '🌙'}
          </button>
          <button id="logoutBtn" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-min" title="Cerrar sesión">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
            </svg>
          </button>
        </div>
      </div>`
    header.className = 'sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700'
  }

  // ── Bottom Nav ───────────────────────────────────────
  const nav = document.getElementById('bottomNav')
  if (nav) {
    const items = [
      { page: 'dashboard',    href: './dashboard.html',    icon: '🏠', label: 'Inicio' },
      { page: 'temas',        href: './temas.html',        icon: '📖', label: 'Temas' },
      { page: 'importar',     href: './importar.html',     icon: '📤', label: 'Importar' },
      { page: 'estadisticas', href: './estadisticas.html', icon: '📊', label: 'Stats' },
      { page: 'falladas',     href: './falladas.html',     icon: '⚠️',  label: 'Falladas' },
    ]
    nav.innerHTML = items.map(it => `
      <a href="${it.href}" data-page="${it.page}"
         class="nav-item flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors
                ${it.page === activePage ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}">
        <span class="text-lg leading-none">${it.icon}</span>
        <span class="text-[10px] font-medium leading-none">${it.label}</span>
      </a>`).join('')
    nav.className = 'fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 safe-bottom'
    nav.style.display = 'flex'
  }
}
