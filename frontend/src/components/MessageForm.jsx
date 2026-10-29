import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import useToast from '../hooks/useToast.js'
import { api, getErrorMessage } from '../services/index.js'

// Formulario "Enviar un mensaje al vendedor" (POST /posts/:id/messages)
export default function MessageForm({ postId, disabled = false, sellerName }) {
  const { notify } = useToast()
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSending(true)
    try {
      await api.sendMessage(postId, body)
      setBody('')
      notify(`Mensaje enviado a ${sellerName}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <Form onSubmit={submit}>
      <Form.Group controlId="message-body" className="mb-2">
        <Form.Label className="fw-semibold">Enviar un mensaje al vendedor</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={disabled ? 'Esta publicación es tuya' : 'Escribe tu mensaje…'}
          disabled={disabled || sending}
        />
      </Form.Group>
      {error && <Alert variant="danger" className="py-2">{error}</Alert>}
      <Button type="submit" variant="primary" disabled={disabled || sending || !body.trim()}>
        {sending ? 'Enviando…' : 'Enviar mensaje'}
      </Button>
    </Form>
  )
}
