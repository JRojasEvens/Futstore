import { createContext } from 'react'

// Objetos de contexto (los proveedores están en *Context.jsx y los hooks en /hooks)
export const UserContext = createContext(null)
export const ToastContext = createContext(null)
export const MarketContext = createContext(null)
