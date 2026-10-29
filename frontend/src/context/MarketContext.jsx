import { useCallback, useEffect, useMemo, useState } from 'react'
import useUser from '../hooks/useUser.js'
import { api } from '../services/index.js'
import { MarketContext } from './contexts.js'

// Estado global del marketplace: favoritos del usuario logueado.
// Lo comparten las tarjetas, el detalle y el perfil, así el corazón queda
// sincronizado en todas las pantallas.

const fromPost = (post) => ({
  id: post.id,
  title: post.title,
  price: post.price,
  status: post.status,
  card: post.card,
  seller: post.seller,
})
const fromFavorite = ({ post_id, ...rest }) => ({ id: post_id, ...rest })

export function MarketProvider({ children }) {
  const { user } = useUser()
  const userId = user?.id ?? null
  // Los favoritos se guardan junto al usuario al que pertenecen
  const [store, setStore] = useState({ userId: null, list: [] })

  useEffect(() => {
    if (userId === null) return undefined
    let cancelled = false
    api
      .getFavorites()
      .then((list) => !cancelled && setStore({ userId, list: list.map(fromFavorite) }))
      .catch(() => !cancelled && setStore({ userId, list: [] }))
    return () => {
      cancelled = true
    }
  }, [userId])

  const synced = store.userId === userId
  const favorites = useMemo(() => (synced ? store.list : []), [synced, store.list])
  const loadingFavorites = userId !== null && !synced

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites])
  const isFavorite = useCallback((postId) => favoriteIds.has(postId), [favoriteIds])

  // Devuelve true si quedó como favorito, false si se quitó
  const toggleFavorite = useCallback(
    async (post) => {
      if (favoriteIds.has(post.id)) {
        await api.removeFavorite(post.id)
        setStore((s) => ({ ...s, list: s.list.filter((f) => f.id !== post.id) }))
        return false
      }
      await api.addFavorite(post.id)
      setStore((s) => ({ ...s, list: [fromPost(post), ...s.list] }))
      return true
    },
    [favoriteIds],
  )

  const value = useMemo(
    () => ({ favorites, loadingFavorites, isFavorite, toggleFavorite }),
    [favorites, loadingFavorites, isFavorite, toggleFavorite],
  )

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
}
