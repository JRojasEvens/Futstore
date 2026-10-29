import { Col, Row } from 'react-bootstrap'
import EmptyState from './EmptyState.jsx'
import PlayerCard from './PlayerCard.jsx'

// Lista dinámica de tarjetas. `renderActions` permite agregar botones por
// publicación (Editar / Eliminar en "Mis publicaciones").
export default function PostGrid({ posts, empty, renderActions }) {
  if (!posts.length) return <EmptyState {...empty} />
  return (
    <Row xs={2} md={3} xl={4} className="g-3">
      {posts.map((post) => (
        <Col key={post.id}>
          <PlayerCard post={post} />
          {renderActions && <div className="card-actions">{renderActions(post)}</div>}
        </Col>
      ))}
    </Row>
  )
}
