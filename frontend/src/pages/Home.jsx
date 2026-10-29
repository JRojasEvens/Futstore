import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import Loader from '../components/Loader.jsx'
import PlayerCard from '../components/PlayerCard.jsx'
import useUser from '../hooks/useUser.js'
import useFetch from '../hooks/useFetch.js'
import { api } from '../services/index.js'
import { RARITIES } from '../utils/constants.js'

export default function Home() {
  const { isAuthenticated } = useUser()
  const { data: featured, loading, error } = useFetch(() => api.getFeaturedPosts(), [])
  const hero = featured?.slice(0, 3) ?? []
  const rest = featured?.slice(3) ?? []

  return (
    <>
      <section className="hero">
        <Container className="hero__inner">
          <div className="hero__text">
            <h1 className="hero__title">Compra y vende cartas de jugadores</h1>
            <p className="hero__lead">Encuentra la carta que completa tu equipo al mejor precio, o publica las que te sobran.</p>
            <div className="d-flex flex-wrap gap-2">
              <Button as={Link} to="/tienda" variant="warning" size="lg">Ver la tienda</Button>
              {!isAuthenticated && (
                <Button as={Link} to="/registro" variant="outline-light" size="lg">Crear cuenta</Button>
              )}
            </div>
          </div>
          <div className="hero__cards" aria-label="Cartas destacadas">
            {hero.map((post, i) => (
              <div key={post.id} className={`hero__card hero__card--${i + 1}`}>
                <PlayerCard post={post} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-baseline mb-3">
          <h2 className="h4 mb-0">Cartas destacadas</h2>
          <Link to="/tienda">Ver todas</Link>
        </div>
        {loading && <Loader />}
        {error && <EmptyState title="No pudimos cargar las cartas" text="Intenta recargar la página en unos segundos." />}
        {!loading && !error && (
          <div className="featured-row">
            {rest.map((post) => (
              <PlayerCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <h2 className="h5 mt-5 mb-3">Explora por rareza</h2>
        <div className="d-flex flex-wrap gap-2">
          {RARITIES.map((r) => (
            <Link key={r.id} to={`/tienda?rarity=${r.id}`} className="rarity-chip" style={{ '--rarity': r.color }}>
              {r.name}
            </Link>
          ))}
        </div>
      </Container>
    </>
  )
}
