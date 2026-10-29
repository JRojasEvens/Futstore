# 5 · Contrato de datos de la API REST

- **Base URL:** `http://localhost:3000/api`
- **Formato:** JSON (`Content-Type: application/json`)
- **Autenticación:** los endpoints marcados con 🔒 requieren el header `Authorization: Bearer <token>`. El token se obtiene en `POST /login`.
- **Tipos:** `String`, `Number`, `Boolean`, `Date` (ISO 8601). Los precios son enteros en monedas.

## Resumen de endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|:----:|-------------|
| POST | `/users` | No | Registrar usuario |
| POST | `/login` | No | Iniciar sesión |
| GET | `/users/me` | 🔒 | Datos del usuario logueado |
| PUT | `/users/me` | 🔒 | Editar perfil |
| GET | `/cards` | 🔒 | Catálogo de cartas (para el formulario de publicar) |
<<<<<<< HEAD
| GET | `/posts` | 🔒 | Galería de publicaciones con filtros (solo las disponibles) |
| GET | `/posts/featured` | No | Cartas destacadas de la página principal _(agregado en el Hito 2)_ |
=======
| GET | `/posts` | 🔒 | Galería de publicaciones con filtros |
>>>>>>> 6d7863001e5238dd7e4c97a3eab7e9ff9984829b
| GET | `/posts/:id` | 🔒 | Detalle de una publicación |
| POST | `/posts` | 🔒 | Crear publicación |
| PUT | `/posts/:id` | 🔒 | Editar publicación propia |
| DELETE | `/posts/:id` | 🔒 | Eliminar publicación propia |
| GET | `/users/me/posts` | 🔒 | Mis publicaciones |
| GET | `/favorites` | 🔒 | Mis favoritos |
| POST | `/favorites` | 🔒 | Guardar en favoritos |
| DELETE | `/favorites/:postId` | 🔒 | Quitar de favoritos |
| POST | `/posts/:id/messages` | 🔒 | Enviar mensaje al vendedor |

---

## Usuarios y sesión

```
// POST /users
request:
    payload: {
        username: String,
        email: String,
        password: String,   // mínimo 8 caracteres
        picture: String,    // URL, opcional
    }

response: 201
    {
        id: Number,
        username: String,
        email: String,
        picture: String,
    }
```

```
// POST /login
request:
    payload: {
        email: String,
        password: String,
    }

response: 200
    {
        token: String,
        user: {
            id: Number,
            username: String,
            email: String,
            picture: String,
        }
    }
```

```
// GET /users/me   🔒
response: 200
    {
        id: Number,
        username: String,
        email: String,
        picture: String,
        created_at: Date,
    }
```

```
// PUT /users/me   🔒
request:
    payload: {
        username: String,   // opcional
        picture: String,    // opcional
    }

response: 200
    {
        id: Number,
        username: String,
        email: String,
        picture: String,
    }
```

## Catálogo de cartas

```
// GET /cards?search=String&rarity=Number&position=String   🔒
response: 200
    [
        {
            id: Number,
            player_name: String,
            position: String,
            club: String,
            nation: String,
            overall: Number,
            rarity: { id: Number, name: String, color: String },
            stats: {
                pace: Number, shooting: Number, passing: Number,
                dribbling: Number, defending: Number, physical: Number,
            },
            image_url: String,
        }
    ]
```

## Publicaciones

```
// GET /posts   🔒
request:
    query: {
        search: String,       // nombre del jugador, opcional
        rarity: Number,       // id de rareza, opcional
        position: String,     // opcional
        club: String,         // opcional
        min_overall: Number,  // opcional
        max_overall: Number,  // opcional
        min_price: Number,    // opcional
        max_price: Number,    // opcional
        sort: String,         // "recent" | "price_asc" | "price_desc" | "overall_desc"
        page: Number,         // por defecto 1
        limit: Number,        // por defecto 12
    }

response: 200
    {
        total: Number,
        page: Number,
        limit: Number,
        results: [
            {
                id: Number,
                title: String,
                price: Number,
                status: String,
                image_url: String,
                is_favorite: Boolean,
                card: {
                    player_name: String,
                    position: String,
                    overall: Number,
                    rarity: { name: String, color: String },
                },
                seller: { id: Number, username: String },
            }
        ]
    }
```

```
<<<<<<< HEAD
// GET /posts/featured   (público, agregado en el Hito 2)
// La página principal es pública, por eso necesita un endpoint sin sesión.
// Devuelve hasta 8 publicaciones disponibles, de mayor a menor valoración.
response: 200
    [
        {
            id: Number,
            title: String,
            price: Number,
            status: String,
            image_url: String,
            card: {
                player_name: String,
                position: String,
                overall: Number,
                rarity: { name: String, color: String },
            },
            seller: { id: Number, username: String },
        }
    ]
```

```
=======
>>>>>>> 6d7863001e5238dd7e4c97a3eab7e9ff9984829b
// GET /posts/:id   🔒
response: 200
    {
        id: Number,
        title: String,
        description: String,
        price: Number,
        status: String,
        image_url: String,
        created_at: Date,
        is_favorite: Boolean,
        card: {
            id: Number,
            player_name: String,
            position: String,
            club: String,
            nation: String,
            overall: Number,
            rarity: { id: Number, name: String, color: String },
            stats: {
                pace: Number, shooting: Number, passing: Number,
                dribbling: Number, defending: Number, physical: Number,
            },
        },
        seller: { id: Number, username: String, picture: String },
    }

response: 404
    { error: "Publicación no encontrada" }
```

```
// POST /posts   🔒
request:
    payload: {
        card_id: Number,
        title: String,
        description: String,   // opcional
        price: Number,         // entero mayor a 0
        image_url: String,     // opcional
    }

response: 201
    {
        id: Number,
        card_id: Number,
        seller_id: Number,
        title: String,
        description: String,
        price: Number,
        status: "available",
        image_url: String,
        created_at: Date,
    }
```

```
// PUT /posts/:id   🔒  (solo el vendedor)
request:
    payload: {
        title: String,         // opcional
        description: String,   // opcional
        price: Number,         // opcional
        status: String,        // opcional: "available" | "paused" | "sold"
    }

response: 200
    { id: Number, title: String, description: String, price: Number, status: String }

response: 403
    { error: "No puedes modificar una publicación de otro usuario" }
```

```
// DELETE /posts/:id   🔒  (solo el vendedor)
response: 204 (sin contenido)
```

```
// GET /users/me/posts   🔒
response: 200
    [
        {
            id: Number,
            title: String,
            price: Number,
            status: String,
            card: { player_name: String, position: String, overall: Number, rarity: { name: String, color: String } },
        }
    ]
```

## Favoritos

```
// GET /favorites   🔒
response: 200
    [
        {
            post_id: Number,
            title: String,
            price: Number,
            status: String,
            card: { player_name: String, position: String, overall: Number, rarity: { name: String, color: String } },
            seller: { id: Number, username: String },
        }
    ]
```

```
// POST /favorites   🔒
request:
    payload: {
        post_id: Number,
    }

response: 201
    { id: Number, user_id: Number, post_id: Number }

response: 409
    { error: "La publicación ya está en tus favoritos" }
```

```
// DELETE /favorites/:postId   🔒
response: 204 (sin contenido)
```

## Mensajes

```
// POST /posts/:id/messages   🔒
request:
    payload: {
        body: String,
    }

response: 201
    {
        id: Number,
        post_id: Number,
        sender_id: Number,
        body: String,
        created_at: Date,
    }

response: 400
    { error: "No puedes enviarte mensajes a ti mismo" }
```

## Errores comunes

Todos los errores responden con el mismo formato:

```
{ error: String }
```

| Código | Cuándo ocurre |
|:------:|---------------|
| 400 | Datos faltantes o inválidos |
| 401 | Token ausente, inválido o credenciales incorrectas en `/login` |
| 403 | El usuario no es dueño del recurso |
| 404 | El recurso no existe |
| 409 | Conflicto, por ejemplo correo ya registrado o favorito duplicado |
| 500 | Error interno del servidor |
