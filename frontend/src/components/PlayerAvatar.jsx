// Foto del jugador. Si la carta no tiene imagen se dibuja una silueta.
export default function PlayerAvatar({ src, name = '', className = '' }) {
  if (src) return <img src={src} alt={name} className={`player-avatar ${className}`} loading="lazy" />
  return (
    <svg className={`player-avatar ${className}`} viewBox="0 0 100 100" role="img" aria-label={name ? `Silueta de ${name}` : 'Silueta de jugador'}>
      <circle cx="50" cy="32" r="17" fill="currentColor" opacity=".35" />
      <path d="M14 98c2-24 16-38 36-38s34 14 36 38z" fill="currentColor" opacity=".35" />
    </svg>
  )
}
