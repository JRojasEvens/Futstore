# FutStore · Marketplace de cartas virtuales

Aplicación web donde los usuarios compran y publican **cartas virtuales de jugadores de fútbol** (con valoración, posición, rareza y estadísticas), inspirada en sitios de comunidad como FUT.GG. Los precios se expresan en monedas virtuales.

## Enlaces

| | |
|---|---|
| **Deploy (Vercel)** | **https://futstore-two.vercel.app** |
| **Repositorio (GitHub)** | https://github.com/JRojasEvens/Futstore |

> **Para probarla rápido:** entra al deploy e inicia sesión con la cuenta de demostración `demo@futstore.cl` / `12345678`, o crea tu propia cuenta desde "Regístrate".

## Funcionalidades

- **Página principal pública** con cartas destacadas y acceso por rareza.
- **Registro e inicio de sesión.** La sesión se mantiene al recargar la página y se cierra con "Cerrar sesión".
- **Tienda** con filtros (jugador, rareza, posición, club, valoración y precio), orden, paginación y filtros guardados en la URL.
- **Detalle de una publicación** con estadísticas de la carta, datos del vendedor y envío de mensajes.
- **Publicar una carta** eligiéndola del catálogo, con vista previa en vivo.
- **Favoritos:** guardar y quitar publicaciones desde cualquier vista.
- **Mi perfil:** editar nombre y foto, ver y administrar mis publicaciones (editar, pausar, marcar como vendida, eliminar) y mis favoritos.
- **Vistas públicas y privadas:** las vistas privadas redirigen a `/login` y, tras iniciar sesión, devuelven al usuario a la página que quería abrir.

## Tecnologías

React 19 · Vite · React Router · Context API · Bootstrap y React Bootstrap · Axios · Vitest y Testing Library

## Instalación

### Requisitos

- [Node.js](https://nodejs.org) 20 o superior (incluye `npm`)
- [Git](https://git-scm.com)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/JRojasEvens/Futstore.git
cd futstore/frontend

# 2. Instalar dependencias
npm install

# 3. (Opcional) crear el archivo de variables de entorno
cp .env.example .env

# 4. Iniciar la aplicación
npm run dev
```

Abre **http://localhost:5173** en el navegador.

### Comandos disponibles

Se ejecutan dentro de la carpeta `frontend/`:

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |
| `npm run lint` | Revisa la calidad del código |
| `npm test` | Ejecuta las 27 pruebas automáticas |

### Variables de entorno

Están en `frontend/.env.example`. La aplicación funciona sin crear el `.env`.

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `VITE_USE_MOCK` | `true` | `true`: modo demostración, sin servidor. `false`: usa la API real |
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de la API REST (solo si `VITE_USE_MOCK=false`) |

### Modo demostración

El proyecto incluye datos de ejemplo (jugadores ficticios) que respetan el formato del [contrato de la API](docs/05-contrato-api/contrato-api.md), por lo que funciona completo sin backend. Los cambios (cuentas nuevas, publicaciones, favoritos) se guardan en el `localStorage` del navegador de cada visitante. Cuentas disponibles:

| Usuario | Correo | Contraseña |
|---------|--------|------------|
| demo | `demo@futstore.cl` | `12345678` |
| karla_fut | `karla@futstore.cl` | `12345678` |
| tito_cards | `tito@futstore.cl` | `12345678` |

Para conectar un backend real, define en `frontend/.env` `VITE_USE_MOCK=false` y `VITE_API_URL` con la dirección de la API. No hay que modificar ninguna pantalla porque el cliente (`src/services/httpApi.js`) implementa cada endpoint del contrato.

## Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. En [vercel.com](https://vercel.com) elige **Add New → Project** e importa el repositorio.
3. Deja la configuración tal cual: el archivo `vercel.json` ya indica cómo instalar, compilar y publicar `frontend/dist`. Si prefieres, puedes poner **Root Directory** en `frontend` y también funciona.
4. (Opcional) En **Environment Variables** agrega `VITE_USE_MOCK` con el valor `true`.
5. Presiona **Deploy** y copia la URL resultante en la tabla de "Enlaces" de este README.

Cada `git push` a la rama `main` vuelve a desplegar automáticamente. Las rutas como `/tienda` o `/perfil` funcionan al recargar gracias a la regla de reescritura de `vercel.json`.

## Rutas de la aplicación

| Ruta | Acceso | Vista |
|------|--------|-------|
| `/` | Pública | Página principal |
| `/registro` | Pública | Registro de usuarios |
| `/login` | Pública | Inicio de sesión |
| `/tienda` | Privada | Galería de publicaciones |
| `/tienda/:id` | Privada | Detalle de una publicación |
| `/publicar` | Privada | Formulario para crear una publicación |
| `/perfil` | Privada | Mi perfil (redirige a mis publicaciones) |
| `/perfil/publicaciones` | Privada | Mis publicaciones |
| `/perfil/favoritos` | Privada | Mis favoritos |

## Estructura del proyecto

```
futstore/
├── frontend/              aplicación React
│   ├── src/
│   │   ├── components/    piezas reutilizables (navbar, tarjeta, filtros, modales...)
│   │   ├── context/       UserContext, MarketContext, ToastContext
│   │   ├── hooks/         useFetch, useDebounce, usePostFilters, useUser...
│   │   ├── mocks/         datos de demostración
│   │   ├── pages/         una página por vista
│   │   ├── services/      cliente HTTP, API real y API simulada
│   │   ├── test/          pruebas automáticas
│   │   └── utils/         constantes y formato de precios
│   ├── .env.example
│   └── vercel.json
├── docs/                  documentación de diseño (bocetos, navegación, base de datos y contrato de la API)
└── vercel.json
```

Más detalle técnico (hooks, contextos y decisiones) en [`frontend/README.md`](frontend/README.md).

## Documentación de diseño

La planificación inicial del proyecto está en [`docs/`](docs/): [bocetos](docs/01-bocetos/README.md), [mapa de navegación](docs/02-navegacion/README.md), [dependencias](docs/03-dependencias/dependencias.md), [base de datos](docs/04-base-de-datos/README.md) y [contrato de la API REST](docs/05-contrato-api/contrato-api.md).

## Autor

Jorge Rojas Evens
=======
Marketplace web donde los usuarios compran y publican **cartas virtuales de jugadores de fútbol** (con valoración, posición, rareza y estadísticas), inspirado en sitios de comunidad como Futbin Los precios se expresan en **monedas virtuales**.

## Hito 1 · Diseño y prototipo

| # | Requerimiento | Puntos | Entregable |
|---|---------------|:------:|------------|
| 1 | Boceto de las vistas | 3 | [`docs/01-bocetos`](docs/01-bocetos/README.md) |
| 2 | Navegación (vistas públicas y privadas) | 2 | [`docs/02-navegacion`](docs/02-navegacion/README.md) |
| 3 | Dependencias del proyecto | 1 | [`docs/03-dependencias`](docs/03-dependencias/dependencias.md) |
| 4 | Tablas de la base de datos y relaciones | 2 | [`docs/04-base-de-datos`](docs/04-base-de-datos/README.md) |
| 5 | Contrato de datos de la API REST | 2 | [`docs/05-contrato-api`](docs/05-contrato-api/contrato-api.md) |

### Resumen de decisiones de diseño

- **Tema:** cartas de jugadores. Cada publicación es una carta del catálogo puesta a la venta por un usuario.
- **Vistas públicas:** página principal, registro e inicio de sesión.
- **Vistas privadas:** tienda (galería), detalle de publicación, publicar carta, mi perfil (mis publicaciones y mis favoritos).
- **Sesión:** el frontend guarda el usuario y el token en un contexto de React (`UserContext`), persistido en `localStorage`.
- **Adaptación del boceto base:** el enunciado sugiere un mapa en el detalle. Como las cartas son virtuales no tienen ubicación física, así que se reemplazó por las estadísticas de la carta y los datos del vendedor.

## Estructura del repositorio

```
futstore/
├── README.md
├── .gitignore
└── docs/
    ├── 01-bocetos/        8 pantallas en SVG y PNG
    ├── 02-navegacion/     mapa de vistas públicas y privadas
    ├── 03-dependencias/   dependencias de frontend y backend
    ├── 04-base-de-datos/  diagrama ER y script SQL
    └── 05-contrato-api/   endpoints, requests y responses
```

En los próximos hitos se agregarán las carpetas `frontend/` y `backend/`.

## Integrante

- Jorge Rojas Evens
>>>>>>> 6d7863001e5238dd7e4c97a3eab7e9ff9984829b
