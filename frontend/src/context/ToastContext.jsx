import { useCallback, useMemo, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { ToastContext } from './contexts.js'

// Avisos globales ("Publicación creada", "Agregada a favoritos"...)
let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const notify = useCallback((message, variant = 'success') => {
    setToasts((list) => [...list, { id: nextId++, message, variant }])
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 1100 }}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={t.variant}
            onClose={() => dismiss(t.id)}
            delay={3000}
            autohide
            role="status"
          >
            <Toast.Body className={t.variant === 'warning' ? 'text-dark' : 'text-white'}>{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}
