async function requireAuth() {
  const authRequest = db.auth.getSession()
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('No se pudo comprobar la sesion. Recarga la pagina o inicia sesion de nuevo.')), 10000)
  })
  const { data: { session } } = await Promise.race([authRequest, timeout])
  if (!session) {
    window.location.replace('./index.html?v=20260506-10')
    return null
  }
  return session
}

async function login(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

async function register(email, password) {
  const { data, error } = await db.auth.signUp({ email, password })
  if (error) throw error
  return data
}

async function logout() {
  await db.auth.signOut()
  window.location.replace('./index.html?v=20260506-10')
}
