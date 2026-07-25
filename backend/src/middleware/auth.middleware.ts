import { jwtVerify } from 'jose'
import type { Context, Next } from 'hono'
import type { UserRole } from '../types/user'
import { createSupabase } from '../lib/supabase'

type Env = {
  JWT_SECRET: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

export type JWTPayload = {
  user_id: number
  role: UserRole
  token_version?: number
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
    const jwtUser = payload as JWTPayload

    // Cek token_version ke database — kalau user sudah logout (atau ganti
    // password), token_version di DB sudah naik dan token lama otomatis
    // ditolak walau tanda tangannya masih valid & belum expired.
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    const { data: dbUser, error } = await supabase
      .from('users')
      .select('token_version')
      .eq('id', jwtUser.user_id)
      .is('deleted_at', null)
      .single()

    if (error || !dbUser || (dbUser.token_version ?? 0) !== (jwtUser.token_version ?? 0)) {
      return c.json(
        {
          status: 'error',
          message: 'Sesi sudah berakhir, silakan login kembali',
        },
        401
      )
    }

    c.set('user', jwtUser)

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