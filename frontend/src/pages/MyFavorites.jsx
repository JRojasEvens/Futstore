import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import PostGrid from '../components/PostGrid.jsx'
import useMarket from '../hooks/useMarket.js'

export default function MyFavorites() {
  const { favorites, loadingFavorites } = useMarket()

  if (loadingFavorites) return <Loader label="Cargando tus favoritos…" />

  return (
    <>
      <PostGrid
        posts={favorites}
        empty={{ title: 'Todavía no guardas favoritos', text: 'Toca el corazón de una carta para guardarla aquí.' }}
      />
      {!favorites.length && <div className="text-center mt-3"><Button as={Link} to="/tienda" variant="primary">Ir a la tienda</Button></div>}
    </>
  )
}
