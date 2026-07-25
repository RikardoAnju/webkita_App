import { cors } from 'hono/cors'

// Wildcard origin ('*') mengizinkan situs mana pun memanggil API ini dari
// browser korban yang sudah login (token dikirim manual lewat JS, bukan
// cookie, jadi risikonya bukan CSRF klasik, tapi tetap membuka pintu untuk
// menyalin/menyalahgunakan API dari domain lain). Dibatasi ke domain
// frontend yang sah + localhost untuk development.
const ALLOWED_ORIGINS = [
  'https://www.webkita.online',
  'https://webkita.online',
  'http://localhost:5173',
  'http://localhost:3000',
]

export const corsMiddleware = cors({
  origin: (origin) => (origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]),
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
  ],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
  credentials: false,
})