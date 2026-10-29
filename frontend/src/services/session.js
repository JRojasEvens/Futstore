import { storage } from './storage.js'

const KEY = 'futstore_session'

// La sesión guarda { token, user } tal como responde POST /login
export const getSession = () => {
  try {
    return JSON.parse(storage.getItem(KEY))
  } catch {
    return null
  }
}
export const saveSession = (session) => storage.setItem(KEY, JSON.stringify(session))
export const clearSession = () => storage.removeItem(KEY)
