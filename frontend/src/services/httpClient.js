import axios from 'axios'
import { clearSession, getSession } from './session.js'

export const UNAUTHORIZED_EVENT = 'futstore:unauthorized'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Agrega el token JWT a cada petición: Authorization: Bearer <token>
http.interceptors.request.use((config) => {
  const session = getSession()
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`
  return config
})

// Si la API responde 401 con una sesión activa, la sesión expiró
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getSession()) {
      clearSession()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  },
)
