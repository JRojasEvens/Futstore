// Rarezas del catálogo (coinciden con la tabla `rarities` del Hito 1)
export const RARITIES = [
  { id: 1, name: 'Común', color: '#8a9a94' },
  { id: 2, name: 'Rara', color: '#2f7fc4' },
  { id: 3, name: 'Épica', color: '#8a4fd0' },
  { id: 4, name: 'Leyenda', color: '#d99a0b' },
  { id: 5, name: 'Icono', color: '#12a88a' },
]

export const POSITIONS = ['POR', 'DFC', 'LTD', 'LTI', 'MCD', 'MC', 'MCO', 'ED', 'EI', 'DC']

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'overall_desc', label: 'Mayor valoración' },
]

export const POST_STATUS = [
  { value: 'available', label: 'Disponible' },
  { value: 'paused', label: 'Pausada' },
  { value: 'sold', label: 'Vendida' },
]

export const STAT_LABELS = [
  { key: 'pace', short: 'RIT', label: 'Ritmo' },
  { key: 'shooting', short: 'TIR', label: 'Tiro' },
  { key: 'passing', short: 'PAS', label: 'Pase' },
  { key: 'dribbling', short: 'REG', label: 'Regate' },
  { key: 'defending', short: 'DEF', label: 'Defensa' },
  { key: 'physical', short: 'FIS', label: 'Físico' },
]

export const PAGE_SIZE = 12

export const formatPrice = (value) => new Intl.NumberFormat('es-CL').format(value ?? 0)
