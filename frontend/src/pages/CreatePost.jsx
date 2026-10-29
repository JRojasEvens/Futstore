import { useMemo, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import PlayerCard from '../components/PlayerCard.jsx'
import useToast from '../hooks/useToast.js'
import useUser from '../hooks/useUser.js'
import useDebounce from '../hooks/useDebounce.js'
import useFetch from '../hooks/useFetch.js'
import { api, getErrorMessage } from '../services/index.js'

const autoTitle = (card) => `${card.player_name} · ${card.rarity.name} ${card.overall}`

export default function CreatePost() {
  const { user } = useUser()
  const { notify } = useToast()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data: cards, loading: loadingCards } = useFetch(() => api.getCards({ search: debouncedSearch }), [debouncedSearch])

  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ title: '', price: '', description: '', image_url: '' })
  const [titleTouched, setTitleTouched] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const change = (e) => {
    if (e.target.name === 'title') setTitleTouched(true)
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const options = useMemo(() => {
    const list = cards ?? []
    return selected && !list.some((c) => c.id === selected.id) ? [selected, ...list] : list
  }, [cards, selected])

  const pickCard = (e) => {
    const card = options.find((c) => c.id === Number(e.target.value)) ?? null
    setSelected(card)
    if (card && !titleTouched) setForm((f) => ({ ...f, title: autoTitle(card) }))
  }

  // Vista previa con el mismo componente que usa la tienda
  const preview = {
    id: 0,
    title: form.title,
    price: Number(form.price) || 0,
    image_url: form.image_url,
    card: selected
      ? { player_name: selected.player_name, position: selected.position, overall: selected.overall, rarity: selected.rarity }
      : { player_name: 'Elige una carta', position: '—', overall: '—', rarity: { name: 'Sin rareza', color: '#8a9a94' } },
    seller: { username: user.username },
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!selected) return setError('Selecciona una carta del catálogo')
    if (!Number.isInteger(Number(form.price)) || Number(form.price) <= 0) return setError('El precio debe ser un número entero mayor a 0')
    setSaving(true)
    try {
      await api.createPost({ ...form, card_id: selected.id, price: Number(form.price) })
      notify('Publicación creada')
      navigate('/perfil/publicaciones')
    } catch (err) {
      setError(getErrorMessage(err))
      setSaving(false)
    }
  }

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">Publicar una carta</h1>
      <Row className="g-4">
        <Col lg={8}>
          <Form onSubmit={submit} className="form-panel">
            <Form.Group className="mb-3" controlId="post-search">
              <Form.Label>Buscar en el catálogo</Form.Label>
              <Form.Control value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre del jugador…" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="post-card">
              <Form.Label>Carta</Form.Label>
              <Form.Select value={selected?.id ?? ''} onChange={pickCard} disabled={loadingCards && !options.length}>
                <option value="">{loadingCards ? 'Cargando catálogo…' : 'Selecciona una carta'}</option>
                {options.map((c) => (
                  <option key={c.id} value={c.id}>{`${c.player_name} · ${c.position} · ${c.overall} (${c.rarity.name})`}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="post-title">
              <Form.Label>Título de la publicación</Form.Label>
              <Form.Control name="title" value={form.title} onChange={change} maxLength={120} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="post-price">
              <Form.Label>Precio (monedas)</Form.Label>
              <Form.Control type="number" min="1" step="1" name="price" value={form.price} onChange={change} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="post-description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={change} />
            </Form.Group>
            <Form.Group className="mb-4" controlId="post-image">
              <Form.Label>URL de imagen adicional (opcional)</Form.Label>
              <Form.Control type="url" name="image_url" value={form.image_url} onChange={change} placeholder="https://…" />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Publicando…' : 'Publicar'}</Button>
            </div>
          </Form>
        </Col>
        <Col lg={4}>
          <div className="form-panel text-center">
            <h2 className="h6 mb-3">Vista previa</h2>
            <div className="preview-card"><PlayerCard post={preview} preview size="lg" /></div>
            <p className="small text-secondary mt-3 mb-0">Así verán tu publicación en la tienda.</p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
