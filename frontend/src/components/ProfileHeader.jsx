import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useUser from '../hooks/useUser.js'
import EditProfileModal from './EditProfileModal.jsx'

export default function ProfileHeader() {
  const { user } = useUser()
  const [editing, setEditing] = useState(false)

  return (
    <section className="profile-header">
      {user.picture ? (
        <img src={user.picture} alt={`Foto de ${user.username}`} className="profile-header__avatar" />
      ) : (
        <span className="profile-header__avatar profile-header__avatar--initial" aria-hidden="true">{user.username[0].toUpperCase()}</span>
      )}
      <div className="flex-grow-1">
        <h1 className="h3 mb-0">{user.username}</h1>
        <p className="mb-0 text-secondary">{user.email}</p>
      </div>
      <div className="d-flex flex-column flex-sm-row gap-2">
        <Button variant="outline-secondary" onClick={() => setEditing(true)}>Editar perfil</Button>
        <Button as={Link} to="/publicar" variant="primary">Nueva publicación</Button>
      </div>
      {editing && <EditProfileModal onHide={() => setEditing(false)} />}
    </section>
  )
}
