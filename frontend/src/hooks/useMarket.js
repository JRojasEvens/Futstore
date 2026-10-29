import { useContext } from 'react'
import { MarketContext } from '../context/contexts.js'

export default function useMarket() {
  const ctx = useContext(MarketContext)
  if (!ctx) throw new Error('useMarket debe usarse dentro de <MarketProvider>')
  return ctx
}
