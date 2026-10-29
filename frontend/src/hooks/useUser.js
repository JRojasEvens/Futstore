import { useContext } from 'react'
import { UserContext } from '../context/contexts.js'

export default function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser debe usarse dentro de <UserProvider>')
  return ctx
}
