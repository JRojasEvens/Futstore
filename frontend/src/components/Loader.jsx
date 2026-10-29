import { Spinner } from 'react-bootstrap'

export default function Loader({ label = 'Cargando…' }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-5 text-secondary" role="status">
      <Spinner animation="border" size="sm" />
      <span>{label}</span>
    </div>
  )
}
