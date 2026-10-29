import { startTransition } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useUser from '../hooks/useUser.js'
import Logo from './Logo.jsx'

export default function AppNavbar() {
  const { user, isAuthenticated, logout } = useUser()
  const navigate = useNavigate()

  // Cerrar sesión y volver a la portada en una sola actualización; si no, las
  // rutas privadas alcanzan a redirigir a /login antes de llegar a "/"
  const handleLogout = () => {
    startTransition(() => {
      logout()
      navigate('/')
    })
  }

  return (
    <Navbar expand="md" variant="dark" sticky="top" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <Logo />
          <span>FutStore</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/tienda">Tienda</Nav.Link>
            {isAuthenticated && <Nav.Link as={NavLink} to="/publicar">Publicar carta</Nav.Link>}
          </Nav>
          <Nav className="align-items-md-center gap-md-2">
            {isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/perfil" className="d-flex align-items-center gap-2">
                  {user.picture ? (
                    <img src={user.picture} alt="" className="nav-avatar" />
                  ) : (
                    <span className="nav-avatar nav-avatar--initial" aria-hidden="true">{user.username[0].toUpperCase()}</span>
                  )}
                  Mi perfil
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Cerrar sesión</Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/registro">Regístrate</Nav.Link>
                <Button as={Link} to="/login" variant="warning" size="sm">Iniciar sesión</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
