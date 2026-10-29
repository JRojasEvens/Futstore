import { MarketProvider } from './MarketContext.jsx'
import { ToastProvider } from './ToastContext.jsx'
import { UserProvider } from './UserContext.jsx'

// El orden importa: Market necesita al usuario y Toast se usa en todas partes
export default function AppProviders({ children }) {
  return (
    <UserProvider>
      <ToastProvider>
        <MarketProvider>{children}</MarketProvider>
      </ToastProvider>
    </UserProvider>
  )
}
