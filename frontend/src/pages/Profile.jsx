import { Container, Nav } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router-dom'
import ProfileHeader from '../components/ProfileHeader.jsx'

// Diseño común del perfil: cabecera + pestañas. Las pestañas son rutas anidadas.
export default function Profile() {
  return (
    <Container className="py-4">
      <ProfileHeader />
      <Nav variant="tabs" className="profile-tabs">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/perfil/publicaciones">Mis publicaciones</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/perfil/favoritos">Mis favoritos</Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="pt-4">
        <Outlet />
      </div>
    </Container>
  )
}
