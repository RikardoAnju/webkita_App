import { Hono } from 'hono'
import { createSupabase } from '../lib/supabase'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  createProject,
  deleteProject,
  getAllProjects,
  getMyProjects,
  getProjectById,
  getProjectsByUser,
  updateProjectStatus,
} from '../services/project.service'

type Env = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  JWT_SECRET: string
}

type Variables = {
  user: {
    user_id: number
    role?: string
  }
}

export const projectRoute = new Hono<{
  Bindings: Env
  Variables: Variables
}>()

projectRoute.use('*', authMiddleware)

projectRoute.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const user = c.get('user')
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    const project = await createProject(supabase, user.user_id, body)
    return c.json({ status: 'success', message: 'Project berhasil dibuat', data: project }, 201)
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal membuat project' }, 500)
  }
})

projectRoute.get('/my', async (c) => {
  try {
    const user = c.get('user')
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    const projects = await getMyProjects(supabase, user.user_id)
    return c.json({ status: 'success', message: 'Project berhasil diambil', data: projects })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal mengambil project' }, 500)
  }
})

projectRoute.get('/user/:userId', async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'admin') {
      return c.json({ status: 'error', message: 'Akses hanya untuk admin' }, 403)
    }
    const userId = Number(c.req.param('userId'))
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    const projects = await getProjectsByUser(supabase, userId)
    return c.json({ status: 'success', message: 'Project user berhasil diambil', data: projects })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal mengambil project user' }, 500)
  }
})

projectRoute.patch('/:id/status', async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'admin') {
      return c.json({ status: 'error', message: 'Akses hanya untuk admin' }, 403)
    }
    const id = Number(c.req.param('id'))
    const body = await c.req.json()
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    const project = await updateProjectStatus(supabase, id, body.status)
    return c.json({ status: 'success', message: 'Status project berhasil diupdate', data: project })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal update status project' }, 500)
  }
})

projectRoute.patch('/:id/price', async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'admin') {
      return c.json({ status: 'error', message: 'Akses hanya untuk admin' }, 403)
    }
    const id = Number(c.req.param('id'))
    const body = await c.req.json()
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)

    // Cek apakah harga sudah di-set
    const { data: existing } = await supabase
      .from('projects')
      .select('plan_price_range')
      .eq('id', id)
      .single()

    if (existing?.plan_price_range) {
      return c.json({ status: 'error', message: 'Harga sudah ditetapkan dan tidak dapat diubah' }, 403)
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ plan_price_range: body.plan_price_range, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(error.message)
    return c.json({ status: 'success', message: 'Harga berhasil diset', data })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message }, 500)
  }
})

projectRoute.delete('/:id', async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'admin') {
      return c.json({ status: 'error', message: 'Akses hanya untuk admin' }, 403)
    }
    const id = Number(c.req.param('id'))
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    await deleteProject(supabase, id)
    return c.json({ status: 'success', message: 'Project berhasil dihapus' })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal hapus project' }, 500)
  }
})

projectRoute.get('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))
    const user = c.get('user')
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    const project = await getProjectById(supabase, id)

    // Cegah user lain mengintip detail project (kontak, harga, dsb) milik orang lain
    const isOwner = project.user_id === user.user_id
    const isStaff = user.role === 'admin' || user.role === 'developer'
    if (!isOwner && !isStaff) {
      return c.json({ status: 'error', message: 'Forbidden' }, 403)
    }

    return c.json({ status: 'success', message: 'Detail project berhasil diambil', data: project })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal mengambil detail project' }, 500)
  }
})

projectRoute.get('/', async (c) => {
  try {
    const user = c.get('user')
    if (user.role !== 'admin') {
      return c.json({ status: 'error', message: 'Akses hanya untuk admin' }, 403)
    }
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    const projects = await getAllProjects(supabase)
    return c.json({ status: 'success', message: 'Semua project berhasil diambil', data: projects })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal mengambil semua project' }, 500)
  }
})