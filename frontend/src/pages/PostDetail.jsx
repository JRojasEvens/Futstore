import { Badge, Col, Container, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import FavoriteButton from '../components/FavoriteButton.jsx'
import Loader from '../components/Loader.jsx'
import MessageForm from '../components/MessageForm.jsx'
import PlayerAvatar from '../components/PlayerAvatar.jsx'
import PlayerCard from '../components/PlayerCard.jsx'
import StatBar from '../components/StatBar.jsx'
import useUser from '../hooks/useUser.js'
import useFetch from '../hooks/useFetch.js'
import { api, getErrorMessage } from '../services/index.js'
import { POST_STATUS, STAT_LABELS, formatPrice } from '../utils/constants.js'

export default function PostDetail() {
  const { id } = useParams()
  const { user } = useUser()
  const { data: post, loading, error } = useFetch(() => api.getPostById(id), [id])

  if (loading) return <Container className="py-4"><Loader label="Cargando publicación…" /></Container>
  if (error) {
    return (
      <Container className="py-5">
        <EmptyState title={error.response?.status === 404 ? 'Publicación no encontrada' : 'No pudimos cargar la publicación'} text={getErrorMessage(error)}>
          <Link to="/tienda">Volver a la tienda</Link>
        </EmptyState>
      </Container>
    )
  }

  const { card, seller } = post
  const isOwner = user?.id === seller.id
  const status = POST_STATUS.find((s) => s.value === post.status)

  return (
    <Container className="py-4">
      <nav aria-label="Ruta" className="mb-3 small">
        <Link to="/tienda">Tienda</Link> <span className="text-secondary">/ Detalle de publicación</span>
      </nav>
      <Row className="g-4">
        <Col md={5} lg={4}>
          <div className="detail-card">
            <PlayerCard post={post} preview size="lg" />
          </div>
        </Col>
        <Col md={7} lg={8}>
          <div className="detail-panel">
            <div className="d-flex flex-wrap justify-content-between gap-2 align-items-start">
              <div>
                <h1 className="h3 mb-1">{post.title}</h1>
                <p className="text-secondary mb-2">{[card.rarity.name, card.position, card.club, card.nation].join(' · ')}</p>
              </div>
              {post.status !== 'available' && <Badge bg="secondary">{status?.label}</Badge>}
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 my-3">
              <span className="coin-price coin-price--lg">{formatPrice(post.price)} monedas</span>
              <FavoriteButton post={post} withLabel className="fav-btn--wide" />
            </div>

            <h2 className="h6">Estadísticas</h2>
            <div className="stats-grid mb-4">
              {STAT_LABELS.map((s) => (
                <StatBar key={s.key} short={s.short} label={s.label} value={card.stats[s.key]} />
              ))}
            </div>

            <h2 className="h6">Descripción</h2>
            <p>{post.description || 'El vendedor no agregó una descripción.'}</p>

            <h2 className="h6">Vendedor</h2>
            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="seller-avatar"><PlayerAvatar src={seller.picture} name={seller.username} /></span>
              <span>{seller.username}{isOwner && ' (tú)'}</span>
            </div>

            <MessageForm postId={post.id} sellerName={seller.username} disabled={isOwner} />
          </div>
        </Col>
      </Row>
    </Container>
  )
}
