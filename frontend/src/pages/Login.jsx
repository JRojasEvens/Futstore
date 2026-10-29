import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import useUser from '../hooks/useUser.js'
import { getErrorMessage, isMockMode } from '../services/index.js'
import { DEMO_USER } from '../mocks/data.js'

export default function Login() {
  const { login } = useUser()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = state?.from
  const target = from ? `${from.pathname}${from.search}` : '/tienda'

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(target, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="FutStore" subtitle="Inicia sesión">
      <Form onSubmit={submit}>
        <Form.Group className="mb-3" controlId="login-email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={change} placeholder="nombre@ejemplo.com" autoComplete="email" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="login-password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" value={form.password} onChange={change} autoComplete="current-password" required />
        </Form.Group>
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Entrando…' : 'Iniciar sesión'}</Button>
          <Button as={Link} to="/" variant="light">Volver</Button>
        </div>
      </Form>
      <p className="mt-4 mb-0 small">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
      {isMockMode && (
        <p className="auth-card__demo">
          Modo demostración: <strong>{DEMO_USER.email}</strong> / <strong>{DEMO_USER.password}</strong>
        </p>
      )}
    </AuthLayout>
  )
}
