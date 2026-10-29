import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useUser from '../hooks/useUser.js'

// Vistas privadas: sin sesión se redirige a /login y se recuerda a dónde iba
export function ProtectedRoute() {
  const { isAuthenticated } = useUser()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

// Login y registro: con sesión activa no tiene sentido verlos
export function PublicOnlyRoute() {
  const { isAuthenticated } = useUser()
  const { state } = useLocation()
  // Tras iniciar sesión se vuelve a la vista que se intentó abrir (si existe)
  const from = state?.from
  if (isAuthenticated) return <Navigate to={from ? `${from.pathname}${from.search}` : '/tienda'} replace />
  return <Outlet />
}
