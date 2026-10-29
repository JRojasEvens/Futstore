// Barra de una estadística (ritmo, tiro, pase...)
export default function StatBar({ short, label, value }) {
  const level = value >= 85 ? 'high' : value >= 70 ? 'mid' : 'low'
  return (
    <div className="stat-bar" title={label}>
      <span className="stat-bar__label">{short}</span>
      <div className="stat-bar__track" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={99}>
        <div className={`stat-bar__fill stat-bar__fill--${level}`} style={{ width: `${value}%` }} />
      </div>
      <span className="stat-bar__value">{value}</span>
    </div>
  )
}
