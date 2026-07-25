import type { Context, Next } from 'hono'

export async function loggerMiddleware(
  c: Context,
  next: Next
) {
  console.log(
    `[${new Date().toISOString()}] ${c.req.method} ${c.req.path}`
  )

  await next()
}