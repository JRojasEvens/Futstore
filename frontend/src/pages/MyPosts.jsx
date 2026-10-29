import { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import EditPostModal from '../components/EditPostModal.jsx'
import Loader from '../components/Loader.jsx'
import PostGrid from '../components/PostGrid.jsx'
import useToast from '../hooks/useToast.js'
import useFetch from '../hooks/useFetch.js'
import { api, getErrorMessage } from '../services/index.js'

export default function MyPosts() {
  const { notify } = useToast()
  const { data: posts, loading, error, reload } = useFetch(() => api.getMyPosts(), [])
  const [editing, setEditing] = useState(null)

  const remove = async (post) => {
    if (!window.confirm(`¿Eliminar la publicación "${post.title}"?`)) return
    try {
      await api.deletePost(post.id)
      notify('Publicación eliminada', 'secondary')
      reload()
    } catch (err) {
      notify(getErrorMessage(err), 'danger')
    }
  }

  if (loading) return <Loader label="Cargando tus publicaciones…" />
  if (error) return <Alert variant="danger">{getErrorMessage(error)}</Alert>

  return (
    <>
      <PostGrid
        posts={posts}
        empty={{ title: 'Aún no tienes publicaciones', text: 'Publica una carta y empieza a vender.' }}
        renderActions={(post) => (
          <>
            <Button variant="link" size="sm" onClick={() => setEditing(post)}>Editar</Button>
            <Button variant="link" size="sm" className="text-danger" onClick={() => remove(post)}>Eliminar</Button>
          </>
        )}
      />
      {!posts.length && <div className="text-center mt-3"><Button as={Link} to="/publicar" variant="primary">Publicar carta</Button></div>}
      {editing && (
        <EditPostModal
          post={editing}
          onHide={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            notify('Publicación actualizada')
            reload()
          }}
        />
      )}
    </>
  )
}
