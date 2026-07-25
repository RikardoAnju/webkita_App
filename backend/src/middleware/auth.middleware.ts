import { jwtVerify } from 'jose'
import type { Context, Next } from 'hono'
import type { UserRole } from '../types/user'

type Env = {
  JWT_SECRET: string
}

export type JWTPayload = {
  user_id: number
  role: UserRole
  iat?: number
  exp?: number
}

type Variables = {
  user: JWTPayload
}

export async function authMiddleware(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json(
      {
        status: 'error',
        message: 'Unauthorized',
      },
      401
    )
  }

  try {
    const token = authHeader.replace('Bearer ', '')
    const secret = new TextEncoder().encode(c.env.JWT_SECRET)

    const { payload } = await jwtVerify(token, secret)

    c.set('user', payload as JWTPayload)

    await next()
  } catch {
    return c.json(
      {
        status: 'error',
        message: 'Token tidak valid',
      },
      401
    )
  }
}

export function roleMiddleware(...allowedRoles: UserRole[]) {
  return async (
    c: Context<{ Bindings: Env; Variables: Variables }>,
    next: Next
  ) => {
    const user = c.get('user')

    if (!user?.role || !allowedRoles.includes(user.role)) {
      return c.json(
        {
          status: 'error',
          message: 'Forbidden',
        },
        403
      )
    }

    await next()
  }
}