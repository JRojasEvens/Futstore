import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/index.js'
import { UserContext } from './contexts.js'
import { UNAUTHORIZED_EVENT } from '../services/httpClient.js'
import { clearSession, getSession, saveSession } from '../services/session.js'

// Estado global de la sesión: { token, user }. Se restaura desde localStorage.
export function UserProvider({ children }) {
  const [session, setSession] = useState(() => getSession())

  const login = useCallback(async (credentials) => {
    const data = await api.login(credentials)
    saveSession(data)
    setSession(data)
    return data.user
  }, [])

  const register = useCallback(
    async (payload) => {
      await api.register(payload)
      return login({ email: payload.email, password: payload.password })
    },
    [login],
  )

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const updateProfile = useCallback(
    async (changes) => {
      const updated = await api.updateMe(changes)
      const next = { token: session.token, user: { ...session.user, ...updated } }
      saveSession(next)
      setSession(next)
      return next.user
    },
    [session],
  )

  // Si la API responde 401, la sesión expiró: se cierra automáticamente
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [logout])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      logout,
      updateProfile,
    }),
    [session, login, register, logout, updateProfile],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
