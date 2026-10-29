// Contenedor común del login y el registro
export default function AuthLayout({ title, subtitle, variant = 'light', children }) {
  return (
    <div className="auth-wrap">
      <section className={`auth-card auth-card--${variant}`}>
        <h1 className="h3">{title}</h1>
        <p className="auth-card__subtitle">{subtitle}</p>
        {children}
      </section>
    </div>
  )
}
