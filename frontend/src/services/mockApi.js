import { buildSeed } from '../mocks/data.js'
import { RARITIES } from '../utils/constants.js'
import { getSession } from './session.js'
import { storage } from './storage.js'

// Implementación local del contrato de la API (docs/05-contrato-api).
// Tiene los mismos métodos, respuestas y errores que httpApi, así que al
// conectar el backend real (Hito 3) no hay que modificar ninguna pantalla.

export const mockConfig = { latency: 150 }

const DB_KEY = 'futstore_mock_db'
let db = null

const load = () => {
  if (db) return db
  const raw = storage.getItem(DB_KEY)
  db = raw ? JSON.parse(raw) : buildSeed()
  return db
}
const save = () => storage.setItem(DB_KEY, JSON.stringify(db))

export const resetMockDb = () => {
  db = buildSeed()
  save()
}

const wait = () => new Promise((resolve) => setTimeout(resolve, mockConfig.latency))

const fail = (status, error) => {
  const err = new Error(error)
  err.response = { status, data: { error } }
  throw err
}

const publicUser = ({ id, username, email, picture }) => ({ id, username, email, picture })

const currentUser = () => {
  const session = getSession()
  const user = session && load().users.find((u) => u.id === session.user?.id)
  if (!user) fail(401, 'Debes iniciar sesión')
  return user
}

const rarityOf = (card) => {
  const r = RARITIES.find((x) => x.id === card.rarity_id)
  return { id: r.id, name: r.name, color: r.color }
}
const cardOf = (id) => load().cards.find((c) => c.id === id)
const userOf = (id) => load().users.find((u) => u.id === id)

const cardSummary = (card) => ({
  player_name: card.player_name,
  position: card.position,
  overall: card.overall,
  rarity: { name: rarityOf(card).name, color: rarityOf(card).color },
})

const cardFull = (card) => ({
  id: card.id,
  player_name: card.player_name,
  position: card.position,
  club: card.club,
  nation: card.nation,
  overall: card.overall,
  rarity: rarityOf(card),
  stats: {
    pace: card.pace,
    shooting: card.shooting,
    passing: card.passing,
    dribbling: card.dribbling,
    defending: card.defending,
    physical: card.physical,
  },
  image_url: card.image_url,
})

const isFav = (userId, postId) =>
  load().favorites.some((f) => f.user_id === userId && f.post_id === postId)

const postItem = (post, userId) => ({
  id: post.id,
  title: post.title,
  price: post.price,
  status: post.status,
  image_url: post.image_url,
  is_favorite: userId ? isFav(userId, post.id) : false,
  card: cardSummary(cardOf(post.card_id)),
  seller: { id: post.seller_id, username: userOf(post.seller_id).username },
})

const num = (v) => (v === '' || v == null ? null : Number(v))

export const mockApi = {
  // ---------- Usuarios y sesión ----------
  async register({ username, email, password, picture } = {}) {
    await wait()
    const { users, seq } = load()
    if (!username?.trim() || !email?.trim() || !password) fail(400, 'Completa todos los campos obligatorios')
    if (password.length < 8) fail(400, 'La contraseña debe tener al menos 8 caracteres')
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) fail(409, 'El correo ya está registrado')
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) fail(409, 'El nombre de usuario ya existe')
    const user = {
      id: seq.users++,
      username: username.trim(),
      email: email.trim(),
      password, // solo en modo demostración; el backend real guarda un hash
      picture: picture || '',
      created_at: new Date().toISOString(),
    }
    users.push(user)
    save()
    return publicUser(user)
  },

  async login({ email, password } = {}) {
    await wait()
    const user = load().users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase())
    if (!user || user.password !== password) fail(401, 'Correo o contraseña incorrectos')
    return { token: `mock-token-${user.id}`, user: publicUser(user) }
  },

  async getMe() {
    await wait()
    const { id, username, email, picture, created_at } = currentUser()
    return { id, username, email, picture, created_at }
  },

  async updateMe({ username, picture } = {}) {
    await wait()
    const user = currentUser()
    if (username !== undefined) {
      if (!username.trim()) fail(400, 'El nombre de usuario no puede estar vacío')
      const taken = load().users.some((u) => u.id !== user.id && u.username.toLowerCase() === username.toLowerCase())
      if (taken) fail(409, 'El nombre de usuario ya existe')
      user.username = username.trim()
    }
    if (picture !== undefined) user.picture = picture
    save()
    return publicUser(user)
  },

  // ---------- Catálogo ----------
  async getCards({ search = '', rarity = '', position = '' } = {}) {
    await wait()
    currentUser()
    const q = search.trim().toLowerCase()
    return load()
      .cards.filter((c) => !q || c.player_name.toLowerCase().includes(q))
      .filter((c) => !rarity || c.rarity_id === Number(rarity))
      .filter((c) => !position || c.position === position)
      .map(cardFull)
  },

  // ---------- Publicaciones ----------
  async getPosts(params = {}) {
    await wait()
    const user = currentUser()
    const { search = '', rarity, position, club = '', sort = 'recent' } = params
    const minO = num(params.min_overall), maxO = num(params.max_overall)
    const minP = num(params.min_price), maxP = num(params.max_price)
    const page = Math.max(1, Number(params.page) || 1)
    const limit = Math.max(1, Number(params.limit) || 12)
    const q = search.trim().toLowerCase()

    let list = load()
      .posts.filter((p) => p.status === 'available')
      .map((p) => ({ post: p, card: cardOf(p.card_id) }))
      .filter(({ post, card }) => !q || card.player_name.toLowerCase().includes(q) || post.title.toLowerCase().includes(q))
      .filter(({ card }) => !rarity || card.rarity_id === Number(rarity))
      .filter(({ card }) => !position || card.position === position)
      .filter(({ card }) => !club.trim() || card.club.toLowerCase().includes(club.trim().toLowerCase()))
      .filter(({ card }) => (minO == null || card.overall >= minO) && (maxO == null || card.overall <= maxO))
      .filter(({ post }) => (minP == null || post.price >= minP) && (maxP == null || post.price <= maxP))

    const sorters = {
      recent: (a, b) => b.post.created_at.localeCompare(a.post.created_at),
      price_asc: (a, b) => a.post.price - b.post.price,
      price_desc: (a, b) => b.post.price - a.post.price,
      overall_desc: (a, b) => b.card.overall - a.card.overall,
    }
    list = list.sort(sorters[sort] || sorters.recent)

    return {
      total: list.length,
      page,
      limit,
      results: list.slice((page - 1) * limit, page * limit).map(({ post }) => postItem(post, user.id)),
    }
  },

  // Público (sin sesión): cartas destacadas de la página principal
  async getFeaturedPosts() {
    await wait()
    return load()
      .posts.filter((p) => p.status === 'available')
      .sort((a, b) => cardOf(b.card_id).overall - cardOf(a.card_id).overall)
      .slice(0, 8)
      .map((p) => postItem(p, null))
  },

  async getPostById(id) {
    await wait()
    const user = currentUser()
    const post = load().posts.find((p) => p.id === Number(id))
    if (!post) fail(404, 'Publicación no encontrada')
    const seller = userOf(post.seller_id)
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      price: post.price,
      status: post.status,
      image_url: post.image_url,
      created_at: post.created_at,
      is_favorite: isFav(user.id, post.id),
      card: cardFull(cardOf(post.card_id)),
      seller: { id: seller.id, username: seller.username, picture: seller.picture },
    }
  },

  async createPost({ card_id, title, description = '', price, image_url = '' } = {}) {
    await wait()
    const user = currentUser()
    if (!card_id || !cardOf(Number(card_id))) fail(400, 'Selecciona una carta del catálogo')
    if (!title?.trim()) fail(400, 'El título es obligatorio')
    if (!Number.isInteger(Number(price)) || Number(price) <= 0) fail(400, 'El precio debe ser un número entero mayor a 0')
    const d = load()
    const post = {
      id: d.seq.posts++,
      card_id: Number(card_id),
      seller_id: user.id,
      title: title.trim(),
      description,
      price: Number(price),
      status: 'available',
      image_url,
      created_at: new Date().toISOString(),
    }
    d.posts.push(post)
    save()
    return post
  },

  async updatePost(id, changes = {}) {
    await wait()
    const user = currentUser()
    const post = load().posts.find((p) => p.id === Number(id))
    if (!post) fail(404, 'Publicación no encontrada')
    if (post.seller_id !== user.id) fail(403, 'No puedes modificar una publicación de otro usuario')
    if (changes.price !== undefined && (!Number.isInteger(Number(changes.price)) || Number(changes.price) <= 0))
      fail(400, 'El precio debe ser un número entero mayor a 0')
    for (const key of ['title', 'description', 'status']) if (changes[key] !== undefined) post[key] = changes[key]
    if (changes.price !== undefined) post.price = Number(changes.price)
    save()
    const { title, description, price, status } = post
    return { id: post.id, title, description, price, status }
  },

  async deletePost(id) {
    await wait()
    const user = currentUser()
    const d = load()
    const post = d.posts.find((p) => p.id === Number(id))
    if (!post) fail(404, 'Publicación no encontrada')
    if (post.seller_id !== user.id) fail(403, 'No puedes modificar una publicación de otro usuario')
    d.posts = d.posts.filter((p) => p.id !== post.id)
    d.favorites = d.favorites.filter((f) => f.post_id !== post.id)
    save()
    return null
  },

  async getMyPosts() {
    await wait()
    const user = currentUser()
    return load()
      .posts.filter((p) => p.seller_id === user.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((p) => ({ id: p.id, title: p.title, price: p.price, status: p.status, card: cardSummary(cardOf(p.card_id)) }))
  },

  // ---------- Favoritos ----------
  async getFavorites() {
    await wait()
    const user = currentUser()
    const d = load()
    return d.favorites
      .filter((f) => f.user_id === user.id)
      .map((f) => d.posts.find((p) => p.id === f.post_id))
      .filter(Boolean)
      .map((p) => ({
        post_id: p.id,
        title: p.title,
        price: p.price,
        status: p.status,
        card: cardSummary(cardOf(p.card_id)),
        seller: { id: p.seller_id, username: userOf(p.seller_id).username },
      }))
  },

  async addFavorite(postId) {
    await wait()
    const user = currentUser()
    const d = load()
    if (!d.posts.some((p) => p.id === Number(postId))) fail(404, 'Publicación no encontrada')
    if (isFav(user.id, Number(postId))) fail(409, 'La publicación ya está en tus favoritos')
    const fav = { id: d.seq.favorites++, user_id: user.id, post_id: Number(postId) }
    d.favorites.push(fav)
    save()
    return fav
  },

  async removeFavorite(postId) {
    await wait()
    const user = currentUser()
    const d = load()
    d.favorites = d.favorites.filter((f) => !(f.user_id === user.id && f.post_id === Number(postId)))
    save()
    return null
  },

  // ---------- Mensajes ----------
  async sendMessage(postId, body) {
    await wait()
    const user = currentUser()
    const d = load()
    const post = d.posts.find((p) => p.id === Number(postId))
    if (!post) fail(404, 'Publicación no encontrada')
    if (!body?.trim()) fail(400, 'Escribe un mensaje')
    if (post.seller_id === user.id) fail(400, 'No puedes enviarte mensajes a ti mismo')
    const message = { id: d.seq.messages++, post_id: post.id, sender_id: user.id, body: body.trim(), created_at: new Date().toISOString() }
    d.messages.push(message)
    save()
    return message
  },
}
