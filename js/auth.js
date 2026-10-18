// ── Guarda de autenticación ───────────────────────────
// Llama a requireAuth() al inicio de cada página protegida.
// Redirige a index.html si no hay sesión activa.

async function requireAuth() {
  const { data: { session } } = await db.auth.getSession()
  if (!session) {
    window.location.replace('./index.html')
    return null
  }
  return session
}

// Iniciar sesión
async function login(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Registrar nuevo usuario
async function register(email, password) {
  const { data, error } = await db.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// Cerrar sesión
async function logout() {
  await db.auth.signOut()
  window.location.replace('./index.html')
}

// Rellena el botón de logout si existe en la página
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('logoutBtn')
  if (btn) btn.addEventListener('click', logout)

  const themeBtn = document.getElementById('themeBtn')
  if (themeBtn) {
    const isDark = document.documentElement.classList.contains('dark')
    themeBtn.textContent = isDark ? '☀️' : '🌙'
    themeBtn.addEventListener('click', toggleTheme)
  }
})
