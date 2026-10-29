import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useMarket from '../hooks/useMarket.js'
import useToast from '../hooks/useToast.js'
import useUser from '../hooks/useUser.js'
import { getErrorMessage } from '../services/index.js'

// Corazón para guardar/quitar una publicación. Si no hay sesión lleva al login.
export default function FavoriteButton({ post, withLabel = false, className = '' }) {
  const { isAuthenticated } = useUser()
  const { isFavorite, toggleFavorite } = useMarket()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const active = isFavorite(post.id)

  const handleClick = async () => {
    if (!isAuthenticated) return navigate('/login')
    setBusy(true)
    try {
      const added = await toggleFavorite(post)
      notify(added ? 'Guardada en favoritos' : 'Quitada de favoritos', added ? 'success' : 'secondary')
    } catch (error) {
      notify(getErrorMessage(error), 'danger')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      className={`fav-btn ${active ? 'is-active' : ''} ${className}`}
      onClick={handleClick}
      disabled={busy}
      aria-pressed={active}
      aria-label={active ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5.5 6.2 5.5c1.9 0 3.2 1 3.8 2 .6-1 1.9-2 3.8-2 3.2 0 5 3.1 3.7 6.3C19.5 16.4 12 21 12 21z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {withLabel && <span>{active ? 'Quitar de favoritos' : 'Guardar en favoritos'}</span>}
    </button>
  )
}
