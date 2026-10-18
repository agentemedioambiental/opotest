// ══════════════════════════════════════════════════════
//  CONFIGURACIÓN — edita las dos líneas siguientes
//  con tus credenciales de Supabase
// ══════════════════════════════════════════════════════

const SUPABASE_URL = 'https://beydcypyrmduefuwimek.supabase.co'  // ← cambia esto
const SUPABASE_KEY = 'sb_publishable_dvDwmxzpmlsxwMD5powlrQ_RLIV0CtC'  // ← cambia esto

// ── Cliente Supabase ──────────────────────────────────
// (requiere que supabase-js esté cargado antes)
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Tema (dark mode) ──────────────────────────────────
;(function initTheme() {
  const saved = localStorage.getItem('opotest-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = saved === 'dark' || (!saved && prefersDark)
  if (dark) document.documentElement.classList.add('dark')
})()

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('opotest-theme', isDark ? 'dark' : 'light')
  const btn = document.getElementById('themeBtn')
  if (btn) btn.textContent = isDark ? '☀️' : '🌙'
}
