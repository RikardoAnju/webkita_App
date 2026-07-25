import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth.middleware'
import { createSupabase } from '../lib/supabase'
import { uploadAttachment, getAttachmentsByProject } from '../services/attachment.service'

type Env = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  JWT_SECRET: string
}

type Variables = {
  user: { user_id: number; role?: string }
}

export const attachmentRoute = new Hono<{ Bindings: Env; Variables: Variables }>()

attachmentRoute.use('*', authMiddleware)

// Semua endpoint di sini sebelumnya cuma cek "sudah login", tanpa cek
// apakah project itu benar milik user yang request -- siapa pun yang login
// bisa upload/lihat/download lampiran project ORANG LAIN. Helper ini
// menutup celah itu: hanya pemilik project atau admin/developer yang boleh.
async function assertProjectAccess(
  supabase: ReturnType<typeof createSupabase>,
  projectId: number,
  user: { user_id: number; role?: string }
) {
  if (user.role === 'admin' || user.role === 'developer') return
  const { data: project } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', projectId)
    .single()
  if (!project || project.user_id !== user.user_id) {
    const error = new Error('Forbidden') as Error & { code?: number }
    error.code = 403
    throw error
  }
}

// POST /attachments/:projectId
attachmentRoute.post('/:projectId', async (c) => {
  try {
    const projectId = Number(c.req.param('projectId'))
    const user = c.get('user')
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    await assertProjectAccess(supabase, projectId, user)

    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return c.json({ status: 'error', message: 'File tidak ditemukan' }, 400)
    }

    const attachment = await uploadAttachment(supabase, projectId, file)

    return c.json({ status: 'success', message: 'File berhasil diupload', data: attachment }, 201)
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal upload file' }, err?.code || 500)
  }
})

// GET /attachments/:projectId
attachmentRoute.get('/:projectId', async (c) => {
  try {
    const projectId = Number(c.req.param('projectId'))
    const user = c.get('user')
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    await assertProjectAccess(supabase, projectId, user)

    const attachments = await getAttachmentsByProject(supabase, projectId)

    return c.json({ status: 'success', data: attachments })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal ambil lampiran' }, err?.code || 500)
  }
})


// GET /attachments/download/:id
attachmentRoute.get('/download/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))
    const user = c.get('user')
    const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)

    // Ambil data attachment
    const { data: att, error } = await supabase
      .from('project_attachments')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !att) return c.json({ status: 'error', message: 'File tidak ditemukan' }, 404)

    await assertProjectAccess(supabase, att.project_id, user)

    // Download dari storage
    const { data: file, error: dlError } = await supabase.storage
      .from('project-files')
      .download(att.storage_path)

    if (dlError || !file) return c.json({ status: 'error', message: 'Gagal mengunduh file' }, 500)

    return new Response(file, {
      headers: {
        'Content-Type': att.file_type,
        'Content-Disposition': `attachment; filename="${att.file_name}"`,
      },
    })
  } catch (err: any) {
    return c.json({ status: 'error', message: err?.message || 'Gagal download' }, err?.code || 500)
  }
})