import { httpApi } from './httpApi.js'
import { mockApi } from './mockApi.js'

// Modo demostración: la app funciona sin backend (Hito 3) usando datos locales
// con el mismo formato del contrato. Para usar la API real: VITE_USE_MOCK=false
export const isMockMode = import.meta.env.VITE_USE_MOCK !== 'false'
export const api = isMockMode ? mockApi : httpApi

export const getErrorMessage = (error, fallback = 'Ocurrió un error. Inténtalo nuevamente.') => {
  if (error?.response?.data?.error) return error.response.data.error
  if (error?.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor.'
  return fallback
}
