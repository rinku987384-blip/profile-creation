import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, signIn, signOut, signUp } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let current = true
    getCurrentUser()
      .then(({ user: currentUser }) => { if (current) setUser(currentUser) })
      .catch(() => { if (current) setUser(null) })
      .finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [])

  async function authenticate(request) {
    const result = await request
    setUser(result.user)
    return result.user
  }

  async function login(email, password, rememberMe) {
    return authenticate(signIn(email, password, rememberMe))
  }

  async function register(details) {
    return authenticate(signUp(details))
  }

  async function logout() {
    try { await signOut() } finally { setUser(null) }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
    {children}
  </AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider.')
  return value
}
