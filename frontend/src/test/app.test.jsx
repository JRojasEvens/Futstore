import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App.jsx'
import AppProviders from '../context/AppProviders.jsx'
import { mockConfig, resetMockDb } from '../services/mockApi.js'
import { clearSession, getSession, saveSession } from '../services/session.js'

const renderApp = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppProviders>
        <App />
      </AppProviders>
    </MemoryRouter>,
  )

const startSession = () =>
  saveSession({ token: 'mock-token-1', user: { id: 1, username: 'demo', email: 'demo@futstore.cl', picture: '' } })

// El navbar también tiene un botón "Iniciar sesión": se acota al contenido principal
const mainButton = (name) => within(screen.getByRole('main')).getByRole('button', { name })

const login = async (user) => {
  await user.type(screen.getByLabelText('Correo electrónico'), 'demo@futstore.cl')
  await user.type(screen.getByLabelText('Contraseña'), '12345678')
  await user.click(mainButton('Iniciar sesión'))
}

beforeEach(() => {
  mockConfig.latency = 0
  clearSession()
  resetMockDb()
})

describe('Vistas públicas', () => {
  it('la portada es accesible sin sesión y muestra cartas destacadas', async () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: /compra y vende cartas/i })).toBeInTheDocument()
    expect(await screen.findAllByRole('article')).not.toHaveLength(0)
    expect(screen.getByRole('link', { name: 'Regístrate' })).toBeInTheDocument()
  })

  it('registro y login son públicos', () => {
    renderApp('/registro')
    expect(screen.getByRole('button', { name: 'Registrarme' })).toBeInTheDocument()
  })
})

describe('Rutas privadas y sesión (Context)', () => {
  it('sin sesión, /tienda redirige a /login', async () => {
    renderApp('/tienda')
    expect(await screen.findByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.queryByText('Tienda de cartas')).not.toBeInTheDocument()
  })

  it('login correcto lleva a la tienda y guarda la sesión', async () => {
    const user = userEvent.setup()
    renderApp('/login')
    await login(user)
    expect(await screen.findByRole('heading', { name: 'Tienda de cartas' })).toBeInTheDocument()
    expect(getSession().user.username).toBe('demo')
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
  })

  it('login con datos incorrectos muestra el error de la API', async () => {
    const user = userEvent.setup()
    renderApp('/login')
    await user.type(screen.getByLabelText('Correo electrónico'), 'demo@futstore.cl')
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(mainButton('Iniciar sesión'))
    expect(await screen.findByText('Correo o contraseña incorrectos')).toBeInTheDocument()
  })

  it('después de iniciar sesión vuelve a la vista que se intentó abrir', async () => {
    const user = userEvent.setup()
    renderApp('/tienda/1')
    await login(user)
    expect(await screen.findByText(/Detalle de publicación/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Andrés Bastidas/ })).toBeInTheDocument()
  })

  it('con sesión, /login redirige a la tienda', async () => {
    startSession()
    renderApp('/login')
    expect(await screen.findByRole('heading', { name: 'Tienda de cartas' })).toBeInTheDocument()
  })

  it('cerrar sesión limpia el contexto y vuelve a la portada', async () => {
    const user = userEvent.setup()
    startSession()
    renderApp('/tienda')
    await user.click(await screen.findByRole('button', { name: 'Cerrar sesión' }))
    expect(await screen.findByRole('heading', { name: /compra y vende cartas/i })).toBeInTheDocument()
    expect(getSession()).toBeNull()
  })

  it('una ruta inexistente muestra la página 404', () => {
    renderApp('/no-existe')
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument()
  })
})

describe('Tienda', () => {
  it('filtra por rareza usando la URL y la API', async () => {
    startSession()
    renderApp('/tienda?rarity=5')
    expect(await screen.findByText('2 publicaciones')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('el formulario de filtros aplica la búsqueda por nombre', async () => {
    const user = userEvent.setup()
    startSession()
    renderApp('/tienda')
    await screen.findAllByRole('article')
    await user.type(screen.getByLabelText('Buscar jugador'), 'Hugo')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))
    expect(screen.getByRole('heading', { name: 'Hugo Salazar' })).toBeInTheDocument()
  })

  it('muestra un mensaje cuando no hay resultados', async () => {
    startSession()
    renderApp('/tienda?search=zzzz')
    expect(await screen.findByText('No hay cartas con esos filtros')).toBeInTheDocument()
  })
})

describe('Favoritos (estado global)', () => {
  it('guardar una carta la agrega a Mis favoritos', async () => {
    const user = userEvent.setup()
    startSession()
    renderApp('/tienda')
    await screen.findAllByRole('article')

    const first = screen.getAllByRole('article')[0]
    await user.click(within(first).getByRole('button', { name: 'Guardar en favoritos' }))
    expect(await within(first).findByRole('button', { name: 'Quitar de favoritos' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('link', { name: 'Mi perfil' }))
    await user.click(await screen.findByRole('link', { name: 'Mis favoritos' }))
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2)) // 1 del seed + 1 nueva
  })

  it('un visitante que toca el corazón va al login', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const [card] = await screen.findAllByRole('article')
    await user.click(within(card).getByRole('button', { name: 'Guardar en favoritos' }))
    expect(await screen.findByLabelText('Correo electrónico')).toBeInTheDocument()
  })
})

describe('Publicar y perfil', () => {
  it('crear una publicación la muestra en Mis publicaciones', async () => {
    const user = userEvent.setup()
    startSession()
    renderApp('/publicar')

    const option = await screen.findByRole('option', { name: /Joaquín Salvatierra/ })
    await user.selectOptions(screen.getByLabelText('Carta'), option)
    expect(screen.getByLabelText('Título de la publicación')).toHaveValue('Joaquín Salvatierra · Rara 84')
    await user.type(screen.getByLabelText('Precio (monedas)'), '7500')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByRole('heading', { name: 'demo' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Joaquín Salvatierra' })).toBeInTheDocument()
  })

  it('no deja publicar sin elegir una carta', async () => {
    const user = userEvent.setup()
    startSession()
    renderApp('/publicar')
    await screen.findByRole('option', { name: /Joaquín Salvatierra/ })
    await user.type(screen.getByLabelText('Título de la publicación'), 'Algo')
    await user.type(screen.getByLabelText('Precio (monedas)'), '100')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))
    expect(await screen.findByText('Selecciona una carta del catálogo')).toBeInTheDocument()
  })

  it('el detalle de una publicación propia bloquea el mensaje al vendedor', async () => {
    startSession()
    renderApp('/tienda/13') // publicación de demo
    expect(await screen.findByPlaceholderText('Esta publicación es tuya')).toBeDisabled()
  })

  it('el detalle de otro vendedor permite enviar un mensaje', async () => {
    const user = userEvent.setup()
    startSession()
    renderApp('/tienda/1')
    await user.type(await screen.findByLabelText('Enviar un mensaje al vendedor'), 'Hola, ¿sigue disponible?')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(await screen.findByText('Mensaje enviado a karla_fut')).toBeInTheDocument()
  })
})
