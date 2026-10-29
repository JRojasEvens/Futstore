export default function EmptyState({ title, text, children }) {
  return (
    <div className="empty-state">
      <h2 className="h5">{title}</h2>
      {text && <p className="text-secondary mb-3">{text}</p>}
      {children}
    </div>
  )
}
