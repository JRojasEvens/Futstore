import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { api, getErrorMessage } from '../services/index.js'
import { POST_STATUS } from '../utils/constants.js'

// Edita título, precio y estado de una publicación propia (PUT /posts/:id)
export default function EditPostModal({ post, onHide, onSaved }) {
  const [form, setForm] = useState({ title: post.title, price: String(post.price), status: post.status })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.updatePost(post.id, { ...form, price: Number(form.price) })
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
      setSaving(false)
    }
  }

  return (
    <Modal show onHide={onHide} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">Editar publicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="edit-title">
            <Form.Label>Título</Form.Label>
            <Form.Control name="title" value={form.title} onChange={change} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="edit-price">
            <Form.Label>Precio (monedas)</Form.Label>
            <Form.Control type="number" min="1" step="1" name="price" value={form.price} onChange={change} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="edit-status">
            <Form.Label>Estado</Form.Label>
            <Form.Select name="status" value={form.status} onChange={change}>
              {POST_STATUS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {error && <Alert variant="danger" className="mb-0">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
