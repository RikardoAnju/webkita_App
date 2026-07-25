import type { SupabaseClient } from '@supabase/supabase-js'

function appError(message: string, code = 400) {
  const error = new Error(message) as Error & { code?: number }
  error.code = code
  return error
}

export async function uploadAttachment(
  supabase: SupabaseClient,
  projectId: number,
  file: File
): Promise<any> {
  if (!projectId) throw appError('Project ID tidak valid', 400)
  if (!file) throw appError('File tidak boleh kosong', 400)

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) throw appError('File maksimal 10MB', 400)

  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
  if (!allowedTypes.includes(file.type)) {
    throw appError('Tipe file harus PDF, PNG, atau JPG', 400)
  }

  const ext = file.name.split('.').pop()
  const storagePath = `attachments/${projectId}/${Date.now()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('project-files')
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) throw appError(uploadError.message, 500)

  const { data, error } = await supabase
    .from('project_attachments')
    .insert({
      project_id: projectId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: storagePath,
    })
    .select('*')
    .single()

  if (error) throw appError(error.message, 500)
  return data
}

export async function getAttachmentsByProject(
  supabase: SupabaseClient,
  projectId: number
): Promise<any[]> {
  const { data, error } = await supabase
    .from('project_attachments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw appError(error.message, 500)
  return data
}