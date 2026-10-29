import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
