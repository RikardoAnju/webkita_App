import { Hono } from 'hono'
import { createSupabase } from '../lib/supabase'
import { authMiddleware } from '../middleware/auth.middleware'

type Env = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  JWT_SECRET: string
}

export const userRoute = new Hono<{ Bindings: Env }>()

// GET /api/users — ambil semua user (admin only)
userRoute.get('/', authMiddleware, async (c) => {
  try {
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, email, phone, group_id, role, is_aktif, subscribe_newsletter, email_verified_at, created_at, updated_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      return c.json({ status: 'error', message: error.message }, 500)
    }

    return c.json({
      status: 'success',
      data: data ?? [],
    })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal mengambil data user' }, 500)
  }
})

// DELETE /api/users/:username
userRoute.delete('/:username', authMiddleware, async (c) => {
  try {
    const username = c.req.param('username')
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)

    const { error } = await supabase
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('username', username)

    if (error) {
      return c.json({ status: 'error', message: error.message }, 500)
    }

    return c.json({ status: 'success', message: 'User berhasil dihapus' })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal menghapus user' }, 500)
  }
})