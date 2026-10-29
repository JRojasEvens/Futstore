import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { POSITIONS, RARITIES } from '../utils/constants.js'

// Panel de filtros de la tienda. Trabaja con un borrador y aplica al enviar.
// El padre le cambia la `key` cuando cambian los filtros, así el borrador se reinicia.
export default function FilterSidebar({ filters, onApply, onReset }) {
  const [draft, setDraft] = useState(filters)

  const change = (event) => setDraft((d) => ({ ...d, [event.target.name]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    onApply(draft)
  }

  return (
    <Form onSubmit={submit} className="filter-panel" aria-label="Filtros">
      <h2 className="h5 mb-3">Filtros</h2>

      <Form.Group className="mb-3" controlId="f-search">
        <Form.Label>Buscar jugador</Form.Label>
        <Form.Control name="search" value={draft.search} onChange={change} placeholder="Nombre…" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="f-rarity">
        <Form.Label>Rareza</Form.Label>
        <Form.Select name="rarity" value={draft.rarity} onChange={change}>
          <option value="">Todas</option>
          {RARITIES.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="f-position">
        <Form.Label>Posición</Form.Label>
        <Form.Select name="position" value={draft.position} onChange={change}>
          <option value="">Todas</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="f-club">
        <Form.Label>Club</Form.Label>
        <Form.Control name="club" value={draft.club} onChange={change} placeholder="Ej: Sporting" />
      </Form.Group>

      <fieldset className="mb-3">
        <legend className="form-label fs-6">Valoración</legend>
        <div className="d-flex gap-2">
          <Form.Control type="number" min="1" max="99" name="min_overall" value={draft.min_overall} onChange={change} placeholder="Mín" aria-label="Valoración mínima" />
          <Form.Control type="number" min="1" max="99" name="max_overall" value={draft.max_overall} onChange={change} placeholder="Máx" aria-label="Valoración máxima" />
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="form-label fs-6">Precio (monedas)</legend>
        <div className="d-flex gap-2">
          <Form.Control type="number" min="0" name="min_price" value={draft.min_price} onChange={change} placeholder="Mín" aria-label="Precio mínimo" />
          <Form.Control type="number" min="0" name="max_price" value={draft.max_price} onChange={change} placeholder="Máx" aria-label="Precio máximo" />
        </div>
      </fieldset>

      <Button type="submit" variant="primary" className="w-100 mb-2">Aplicar filtros</Button>
      <Button type="button" variant="link" className="w-100" onClick={onReset}>Limpiar filtros</Button>
    </Form>
  )
}
