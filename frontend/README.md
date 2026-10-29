# FutStore · Frontend (Hito 2)

Aplicación cliente en **React** del marketplace de cartas virtuales. Sigue los bocetos, la navegación, las dependencias y el contrato de la API de la carpeta [`docs/`](../docs/).

Instalación, enlace al deploy y despliegue en Vercel: ver el [README principal](../README.md).

## Cómo ejecutarlo

Requiere Node.js 20 o superior.

```bash
cd frontend
npm install
cp .env.example .env     # opcional, ya funciona con los valores por defecto
npm run dev              # http://localhost:5173
```

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción (`dist/`) |
| `npm run lint` | Revisa el código con oxlint |
| `npm test` | Ejecuta las 27 pruebas (Vitest + Testing Library) |

### Modo demostración

Como el backend se construye en el Hito 3, la app funciona sin servidor con datos locales (jugadores ficticios) que respetan **exactamente** el formato del contrato de la API. Los cambios (registro, publicaciones, favoritos) se guardan en `localStorage`.

- Cuenta de prueba: `demo@futstore.cl` / `12345678`
- Para conectar la API real basta con definir en `.env`: `VITE_USE_MOCK=false` y `VITE_API_URL=http://localhost:3000/api`. No hay que tocar ninguna pantalla.

## Requerimientos del hito

| # | Requerimiento | Puntos | Dónde está |
|---|---------------|:------:|------------|
| 1 | Proyecto creado con `npx` e instalación de dependencias | 1 | Creado con `npx create-vite@latest frontend --template react`. Dependencias en `package.json` (React Router, Bootstrap, React Bootstrap, Axios) |
| 2 | React Router | 3 | `src/App.jsx` y `src/components/ProtectedRoute.jsx` |
| 3 | Componentes con props y renderización dinámica | 1 | `src/components/` (`PlayerCard`, `PostGrid`, `StatBar`, `FilterSidebar`...) |
| 4 | Hooks | 2 | `src/hooks/` y uso de hooks en páginas y componentes |
| 5 | Context API | 3 | `src/context/` |

### 2 · React Router

- Rutas definidas en el diseño: públicas `/`, `/login`, `/registro`; privadas `/tienda`, `/tienda/:id`, `/publicar`, `/perfil` (con rutas anidadas `publicaciones` y `favoritos`) y un `*` para 404.
- `ProtectedRoute` redirige a `/login` si no hay sesión y recuerda la vista pedida para volver a ella tras iniciar sesión.
- `PublicOnlyRoute` evita ver login y registro con una sesión activa.
- Uso de `useParams` (detalle), `useSearchParams` (filtros de la tienda en la URL), `useNavigate`, `useLocation`, `NavLink` y `Outlet` (layout y perfil).

### 3 · Componentes, props y renderización dinámica

- `PlayerCard` es la misma tarjeta en la portada, la tienda, el perfil, el detalle y la vista previa del formulario (props `post`, `preview`, `size`).
- `PostGrid` recorre la lista con `map` y recibe `renderActions` para agregar botones por publicación (Editar y Eliminar en "Mis publicaciones").
- Listas dinámicas: opciones de filtros, rarezas, estadísticas, pestañas y paginación.
- Renderizado condicional: estados de carga, error, vacío, etiquetas de estado (Pausada / Vendida) y navbar según la sesión.

### 4 · Hooks

| Hook | Uso |
|------|-----|
| `useState` | Formularios, borradores de filtros, modales |
| `useEffect` | Carga de datos, escucha de sesión expirada |
| `useMemo` / `useCallback` | Valores de los contextos, parámetros de consulta |
| `useContext` | A través de `useUser`, `useMarket` y `useToast` |
| `useFetch` _(propio)_ | Carga con estados `loading` / `error` y `reload` |
| `useDebounce` _(propio)_ | Búsqueda en el catálogo al publicar |
| `usePostFilters` _(propio)_ | Filtros de la tienda sincronizados con la URL |

### 5 · Context API (estado global)

| Contexto | Guarda |
|----------|--------|
| `UserContext` | Sesión (`token` y `user`), `login`, `register`, `logout`, `updateProfile`. Se restaura desde `localStorage` y se cierra sola si la API responde 401 |
| `MarketContext` | Favoritos del usuario. Mantiene sincronizado el corazón en tienda, detalle y perfil |
| `ToastContext` | Avisos globales ("Publicación creada", "Guardada en favoritos") |

## Preparado para el contrato de la API

`src/services/` tiene un método por endpoint del [contrato](../docs/05-contrato-api/contrato-api.md):

- `httpApi.js`: llamadas reales con Axios. Agrega el header `Authorization: Bearer <token>` y cierra la sesión ante un 401.
- `mockApi.js`: misma interfaz, respuestas y códigos de error, con datos locales.
- `index.js`: elige una u otra según `VITE_USE_MOCK`.

## Estructura

```
src/
├── components/   piezas reutilizables (navbar, tarjeta, filtros, modales...)
├── context/      UserContext, MarketContext, ToastContext
├── hooks/        useFetch, useDebounce, usePostFilters, useUser, useMarket, useToast
├── mocks/        datos de demostración
├── pages/        una página por vista
├── services/     cliente HTTP, API real y API simulada
├── test/         pruebas
└── utils/        constantes y formato de precios
```

## Diferencias respecto a los bocetos

- La foto de perfil se ingresa como URL (el contrato define `picture` como texto), no como archivo.
- El formulario de publicar no pide el estado: toda publicación nueva queda `available`. Se cambia después con "Editar".
- Las tarjetas de la tienda muestran la rareza; las estadísticas completas se ven en el detalle (el listado del contrato no las incluye).
