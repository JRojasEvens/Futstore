import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import useUser from '../hooks/useUser.js'
import { getErrorMessage } from '../services/index.js'

export default function Register() {
  const { register } = useUser()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', repeat: '', picture: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres')
    if (form.password !== form.repeat) return setError('Las contraseñas no coinciden')
    setLoading(true)
    try {
      const { repeat: _repeat, ...payload } = form
      await register(payload) // crea la cuenta e inicia sesión
      navigate('/tienda', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="FutStore" subtitle="Crea tu cuenta" variant="green">
      <Form onSubmit={submit}>
        <Form.Group className="mb-3" controlId="reg-username">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control name="username" value={form.username} onChange={change} autoComplete="username" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="reg-email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={change} placeholder="nombre@ejemplo.com" autoComplete="email" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="reg-password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" value={form.password} onChange={change} autoComplete="new-password" required />
          <Form.Text className="auth-card__hint">Mínimo 8 caracteres</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="reg-repeat">
          <Form.Label>Repetir contraseña</Form.Label>
          <Form.Control type="password" name="repeat" value={form.repeat} onChange={change} autoComplete="new-password" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="reg-picture">
          <Form.Label>URL de la foto de perfil (opcional)</Form.Label>
          <Form.Control type="url" name="picture" value={form.picture} onChange={change} placeholder="https://…" />
        </Form.Group>
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        <div className="d-flex gap-2">
          <Button type="submit" variant="warning" disabled={loading}>{loading ? 'Creando cuenta…' : 'Registrarme'}</Button>
          <Button as={Link} to="/" variant="light">Volver</Button>
        </div>
      </Form>
      <p className="mt-4 mb-0 small">
        ¿Ya tienes cuenta? <Link to="/login" className="text-white">Inicia sesión</Link>
      </p>
    </AuthLayout>
  )
}
