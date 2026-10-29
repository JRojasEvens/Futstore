import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export const FILTER_DEFAULTS = {
  search: '',
  rarity: '',
  position: '',
  club: '',
  min_overall: '',
  max_overall: '',
  min_price: '',
  max_price: '',
  sort: 'recent',
  page: '1',
}

// Los filtros de la tienda viven en la URL (?rarity=4&sort=price_asc), así se
// pueden compartir y el botón "atrás" del navegador funciona.
export default function usePostFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo(() => ({ ...FILTER_DEFAULTS, ...Object.fromEntries(params) }), [params])

  const setFilters = useCallback(
    (changes) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(changes).forEach(([key, value]) => {
            if (value === '' || value == null || value === FILTER_DEFAULTS[key]) next.delete(key)
            else next.set(key, value)
          })
          if (!('page' in changes)) next.delete('page') // cualquier cambio vuelve a la página 1
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const reset = useCallback(() => setParams({}, { replace: true }), [setParams])

  return { filters, setFilters, reset }
}
