import { Container } from 'react-bootstrap'

export default function Footer() {
  return (
    <footer className="app-footer">
      <Container className="d-flex flex-column flex-md-row justify-content-between gap-1">
        <span>FutStore · Marketplace de cartas virtuales</span>
        <span>Proyecto Desafío Latam</span>
      </Container>
    </footer>
  )
}
