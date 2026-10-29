import { http } from './httpClient.js'

const data = (response) => response.data

// Un método por endpoint del contrato (docs/05-contrato-api/contrato-api.md)
export const httpApi = {
  // Usuarios y sesión
  register: (payload) => http.post('/users', payload).then(data),
  login: (payload) => http.post('/login', payload).then(data),
  getMe: () => http.get('/users/me').then(data),
  updateMe: (payload) => http.put('/users/me', payload).then(data),

  // Catálogo
  getCards: (params) => http.get('/cards', { params }).then(data),

  // Publicaciones
  getPosts: (params) => http.get('/posts', { params }).then(data),
  getFeaturedPosts: () => http.get('/posts/featured').then(data),
  getPostById: (id) => http.get(`/posts/${id}`).then(data),
  createPost: (payload) => http.post('/posts', payload).then(data),
  updatePost: (id, payload) => http.put(`/posts/${id}`, payload).then(data),
  deletePost: (id) => http.delete(`/posts/${id}`).then(data),
  getMyPosts: () => http.get('/users/me/posts').then(data),

  // Favoritos
  getFavorites: () => http.get('/favorites').then(data),
  addFavorite: (postId) => http.post('/favorites', { post_id: postId }).then(data),
  removeFavorite: (postId) => http.delete(`/favorites/${postId}`).then(data),

  // Mensajes
  sendMessage: (postId, body) => http.post(`/posts/${postId}/messages`, { body }).then(data),
}
