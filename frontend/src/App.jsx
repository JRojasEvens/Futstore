import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import MyFavorites from './pages/MyFavorites.jsx'
import MyPosts from './pages/MyPosts.jsx'
import NotFound from './pages/NotFound.jsx'
import PostDetail from './pages/PostDetail.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import Store from './pages/Store.jsx'

// Mapa de rutas del Hito 1 (docs/02-navegacion)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route index element={<Home />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Register />} />
        </Route>

        {/* Privadas: requieren sesión */}
        <Route element={<ProtectedRoute />}>
          <Route path="tienda" element={<Store />} />
          <Route path="tienda/:id" element={<PostDetail />} />
          <Route path="publicar" element={<CreatePost />} />
          <Route path="perfil" element={<Profile />}>
            <Route index element={<Navigate to="publicaciones" replace />} />
            <Route path="publicaciones" element={<MyPosts />} />
            <Route path="favoritos" element={<MyFavorites />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
