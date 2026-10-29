import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import useToast from '../hooks/useToast.js'
import useUser from '../hooks/useUser.js'
import { getErrorMessage } from '../services/index.js'

// Edita nombre de usuario y foto (PUT /users/me) y actualiza el contexto
export default function EditProfileModal({ onHide }) {
  const { user, updateProfile } = useUser()
  const { notify } = useToast()
  const [form, setForm] = useState({ username: user.username, picture: user.picture || '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateProfile(form)
      notify('Perfil actualizado')
      onHide()
    } catch (err) {
      setError(getErrorMessage(err))
      setSaving(false)
    }
  }

  return (
    <Modal show onHide={onHide} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">Editar perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="profile-username">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control name="username" value={form.username} onChange={change} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="profile-picture">
            <Form.Label>URL de la foto (opcional)</Form.Label>
            <Form.Control type="url" name="picture" value={form.picture} onChange={change} placeholder="https://…" />
          </Form.Group>
          {error && <Alert variant="danger" className="mb-0">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
