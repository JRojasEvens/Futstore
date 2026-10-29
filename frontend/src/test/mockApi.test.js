import { beforeEach, describe, expect, it } from 'vitest'
import { mockApi, mockConfig, resetMockDb } from '../services/mockApi.js'
import { clearSession, saveSession } from '../services/session.js'

const asUser = (id, username) => saveSession({ token: `mock-token-${id}`, user: { id, username } })
const rejects = async (promise) => promise.then(() => null, (e) => e.response)

beforeEach(() => {
  mockConfig.latency = 0
  clearSession()
  resetMockDb()
})

describe('API simulada (contrato del Hito 1)', () => {
  it('login devuelve token y usuario; con clave incorrecta responde 401', async () => {
    const ok = await mockApi.login({ email: 'demo@futstore.cl', password: '12345678' })
    expect(ok.token).toBeTruthy()
    expect(ok.user).toEqual({ id: 1, username: 'demo', email: 'demo@futstore.cl', picture: '' })
    expect(ok.user.password).toBeUndefined()

    const bad = await rejects(mockApi.login({ email: 'demo@futstore.cl', password: 'xxxx' }))
    expect(bad.status).toBe(401)
  })

  it('registro valida contraseña y correo duplicado', async () => {
    expect((await rejects(mockApi.register({ username: 'a', email: 'a@a.cl', password: '123' }))).status).toBe(400)
    expect((await rejects(mockApi.register({ username: 'x', email: 'demo@futstore.cl', password: '12345678' }))).status).toBe(409)
    const created = await mockApi.register({ username: 'nuevo', email: 'nuevo@futstore.cl', password: '12345678' })
    expect(created.id).toBeGreaterThan(3)
  })

  it('las rutas privadas exigen sesión (401)', async () => {
    expect((await rejects(mockApi.getPosts())).status).toBe(401)
    expect((await rejects(mockApi.getFavorites())).status).toBe(401)
  })

  it('GET /posts filtra, ordena y pagina', async () => {
    asUser(1, 'demo')
    const iconos = await mockApi.getPosts({ rarity: 5 })
    expect(iconos.total).toBe(2)
    expect(iconos.results.every((p) => p.card.rarity.name === 'Icono')).toBe(true)

    const caras = await mockApi.getPosts({ sort: 'price_desc' })
    const precios = caras.results.map((p) => p.price)
    expect(precios).toEqual([...precios].sort((a, b) => b - a))

    const page2 = await mockApi.getPosts({ limit: 5, page: 2 })
    expect(page2.results).toHaveLength(5)
    expect(page2.page).toBe(2)

    // las pausadas no aparecen en la tienda
    const todas = await mockApi.getPosts({ limit: 50 })
    expect(todas.results.some((p) => p.status !== 'available')).toBe(false)
  })

  it('GET /posts/featured es público', async () => {
    const featured = await mockApi.getFeaturedPosts()
    expect(featured).toHaveLength(8)
    expect(featured[0].card.overall).toBeGreaterThanOrEqual(featured[7].card.overall)
  })

  it('detalle devuelve estadísticas y vendedor; 404 si no existe', async () => {
    asUser(1, 'demo')
    const post = await mockApi.getPostById(1)
    expect(post.card.stats).toHaveProperty('pace')
    expect(post.seller.username).toBe('karla_fut')
    expect((await rejects(mockApi.getPostById(999))).status).toBe(404)
  })

  it('favoritos: agregar, duplicado (409) y quitar', async () => {
    asUser(1, 'demo')
    const before = (await mockApi.getFavorites()).length
    await mockApi.addFavorite(3)
    expect((await rejects(mockApi.addFavorite(3))).status).toBe(409)
    expect(await mockApi.getFavorites()).toHaveLength(before + 1)
    await mockApi.removeFavorite(3)
    expect(await mockApi.getFavorites()).toHaveLength(before)
  })

  it('solo el vendedor puede editar o eliminar su publicación (403)', async () => {
    asUser(1, 'demo')
    expect((await rejects(mockApi.updatePost(1, { price: 10 }))).status).toBe(403)
    expect((await rejects(mockApi.deletePost(1))).status).toBe(403)
    const mine = await mockApi.getMyPosts()
    expect(mine.map((p) => p.id)).toEqual([14, 13])
    expect((await mockApi.updatePost(13, { price: 4000 })).price).toBe(4000)
  })

  it('crear publicación valida el precio y no permite mensajes a uno mismo', async () => {
    asUser(1, 'demo')
    expect((await rejects(mockApi.createPost({ card_id: 1, title: 'x', price: 0 }))).status).toBe(400)
    const post = await mockApi.createPost({ card_id: 1, title: 'Mi carta', price: 1000 })
    expect(post.status).toBe('available')
    expect((await rejects(mockApi.sendMessage(post.id, 'hola'))).status).toBe(400)
    expect((await mockApi.sendMessage(1, 'Hola, ¿sigue disponible?')).sender_id).toBe(1)
  })
})
