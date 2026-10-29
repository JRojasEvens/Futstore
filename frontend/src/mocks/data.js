import { RARITIES } from '../utils/constants.js'

// Jugadores ficticios para la demostración (no corresponden a personas reales)
// [nombre, posición, club, nación, valoración, rareza, [ritmo, tiro, pase, regate, defensa, físico]]
const CARD_ROWS = [
  ['Lucas Benítez', 'DC', 'Real Costanera', 'Argentina', 91, 4, [88, 92, 81, 89, 42, 80]],
  ['Mateo Arriaga', 'MCO', 'Atlético Riomar', 'España', 88, 3, [80, 84, 90, 89, 58, 70]],
  ['Thiago Valença', 'ED', 'Sporting Lagos', 'Brasil', 90, 4, [95, 86, 83, 92, 40, 72]],
  ['Joaquín Salvatierra', 'POR', 'Unión Austral', 'Chile', 84, 2, [70, 60, 78, 65, 40, 82]],
  ['Rodrigo Quiroga', 'DFC', 'Deportivo Andes', 'Uruguay', 86, 3, [74, 55, 68, 70, 89, 87]],
  ['Diego Almada', 'MC', 'FC Pampa', 'Argentina', 83, 2, [76, 74, 85, 82, 70, 75]],
  ['Bruno Cavalcanti', 'LTI', 'Sporting Lagos', 'Brasil', 82, 2, [89, 66, 78, 84, 76, 73]],
  ['Álvaro Mendizábal', 'MCD', 'Atlético Riomar', 'España', 80, 2, [68, 62, 79, 72, 82, 81]],
  ['Felipe Contreras', 'DC', 'Unión Austral', 'Chile', 76, 1, [78, 77, 62, 74, 38, 76]],
  ['Nicolás Peralta', 'ED', 'FC Pampa', 'Argentina', 77, 1, [84, 72, 70, 78, 44, 66]],
  ['Santiago Ocampo', 'MC', 'Deportivo Andes', 'Colombia', 75, 1, [70, 68, 76, 73, 66, 70]],
  ['Emiliano Rivas', 'DFC', 'Real Costanera', 'México', 74, 1, [66, 45, 60, 58, 77, 79]],
  ['Andrés Bastidas', 'MCO', 'Deportivo Andes', 'Colombia', 93, 5, [86, 88, 94, 95, 60, 76]],
  ['Hugo Salazar', 'POR', 'Real Costanera', 'España', 92, 5, [74, 68, 84, 72, 46, 88]],
  ['Cristóbal Lagos', 'LTD', 'Sporting Lagos', 'Chile', 81, 2, [87, 68, 77, 82, 74, 72]],
]

export const buildCards = () =>
  CARD_ROWS.map(([player_name, position, club, nation, overall, rarity_id, s], i) => ({
    id: i + 1,
    player_name,
    position,
    club,
    nation,
    overall,
    rarity_id,
    pace: s[0],
    shooting: s[1],
    passing: s[2],
    dribbling: s[3],
    defending: s[4],
    physical: s[5],
    image_url: null,
  }))

// Todas las cuentas de demostración usan la contraseña 12345678
export const DEMO_USER = { email: 'demo@futstore.cl', password: '12345678' }

export const buildUsers = () => [
  { id: 1, username: 'demo', email: 'demo@futstore.cl', password: '12345678', picture: '', created_at: '2026-09-01T10:00:00Z' },
  { id: 2, username: 'karla_fut', email: 'karla@futstore.cl', password: '12345678', picture: '', created_at: '2026-09-03T10:00:00Z' },
  { id: 3, username: 'tito_cards', email: 'tito@futstore.cl', password: '12345678', picture: '', created_at: '2026-09-05T10:00:00Z' },
]

// [card_id, seller_id, precio, estado, descripción]
const POST_ROWS = [
  [13, 2, 98000, 'available', 'Icono con regate y pase de élite. Lo vendo para armar otro equipo.'],
  [1, 3, 54000, 'available', 'Delantero completo, ideal para el ataque. Respuesta rápida por mensaje.'],
  [3, 2, 49500, 'available', 'Extremo veloz, perfecto para contraataques.'],
  [14, 3, 87000, 'available', 'El mejor portero del catálogo. Precio conversable.'],
  [2, 2, 21500, 'available', 'Mediapunta creativa, buenas asistencias.'],
  [5, 3, 18900, 'available', 'Central sólido y fuerte en el juego aéreo.'],
  [4, 2, 6200, 'available', 'Portero confiable para equipos con presupuesto ajustado.'],
  [6, 3, 5400, 'available', 'Mediocampista equilibrado.'],
  [7, 2, 4800, 'available', 'Lateral con mucha proyección ofensiva.'],
  [15, 3, 5100, 'available', 'Lateral derecho veloz.'],
  [9, 2, 1200, 'available', 'Delantero de rotación.'],
  [10, 3, 1500, 'available', 'Extremo para completar plantilla.'],
  [8, 1, 3900, 'available', 'Pivote defensivo, poco uso.'],
  [11, 1, 1100, 'available', 'Carta de relleno para el mediocampo.'],
  [12, 3, 950, 'paused', 'Defensa central, publicación en pausa.'],
]

export const buildPosts = (cards) =>
  POST_ROWS.map(([card_id, seller_id, price, status, description], i) => {
    const card = cards.find((c) => c.id === card_id)
    return {
      id: i + 1,
      card_id,
      seller_id,
      title: `${card.player_name} · ${RARITIES.find((r) => r.id === card.rarity_id).name} ${card.overall}`,
      description,
      price,
      status,
      image_url: null,
      created_at: new Date(Date.UTC(2026, 8, 20) + i * 86400000).toISOString(),
    }
  })

export const buildSeed = () => {
  const cards = buildCards()
  return {
    users: buildUsers(),
    cards,
    posts: buildPosts(cards),
    favorites: [{ id: 1, user_id: 1, post_id: 2 }],
    messages: [],
    seq: { users: 4, posts: POST_ROWS.length + 1, favorites: 2, messages: 1 },
  }
}
