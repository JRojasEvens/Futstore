import { Link } from 'react-router-dom'
import { POST_STATUS, formatPrice } from '../utils/constants.js'
import FavoriteButton from './FavoriteButton.jsx'
import PlayerAvatar from './PlayerAvatar.jsx'

// Tarjeta de una publicación. Se reutiliza en la portada, la tienda, el perfil
// y la vista previa del formulario (preview = sin enlaces ni favorito).
export default function PlayerCard({ post, preview = false, size = 'md' }) {
  const { card, title, price, seller } = post
  const style = { '--rarity': card.rarity.color }
  const statusLabel = post.status && post.status !== 'available' ? POST_STATUS.find((s) => s.value === post.status)?.label : null

  const body = (
    <>
      <div className="player-card__top">
        <span className="player-card__ovr">{card.overall}</span>
        <span className="player-card__pos">{card.position}</span>
      </div>
      <PlayerAvatar src={post.image_url} name={card.player_name} />
      <h3 className="player-card__name">{card.player_name}</h3>
      <span className="player-card__rarity">{card.rarity.name}</span>
    </>
  )

  return (
    <article className={`player-card player-card--${size}`} style={style}>
      {statusLabel && <span className="player-card__status">{statusLabel}</span>}
      {preview ? (
        <div className="player-card__body">{body}</div>
      ) : (
        <Link to={`/tienda/${post.id}`} className="player-card__body" aria-label={`Ver detalle de ${title}`}>
          {body}
        </Link>
      )}
      <div className="player-card__footer">
        <div>
          <span className="coin-price">{formatPrice(price)}</span>
          {seller && <small className="player-card__seller">por {seller.username}</small>}
        </div>
        {!preview && <FavoriteButton post={post} />}
      </div>
    </article>
  )
}
