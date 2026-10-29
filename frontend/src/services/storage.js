// Acceso seguro a localStorage (con respaldo en memoria si no está disponible)
const memory = new Map()
const ls = typeof window !== 'undefined' && window.localStorage ? window.localStorage : null

export const storage = {
  getItem: (key) => (ls ? ls.getItem(key) : memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => (ls ? ls.setItem(key, value) : memory.set(key, value)),
  removeItem: (key) => (ls ? ls.removeItem(key) : memory.delete(key)),
}
