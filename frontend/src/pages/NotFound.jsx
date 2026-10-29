import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'

export default function NotFound() {
  return (
    <Container className="py-5">
      <EmptyState title="Página no encontrada" text="La dirección que buscas no existe o fue movida.">
        <Link to="/">Volver al inicio</Link>
      </EmptyState>
    </Container>
  )
}
