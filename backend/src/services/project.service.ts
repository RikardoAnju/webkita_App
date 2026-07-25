import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Project,
  ProjectStatus,
  ProjectCategory,
  CreateProjectRequest,
} from '../types/project'

function appError(message: string, code = 400) {
  const error = new Error(message) as Error & { code?: number }
  error.code = code
  return error
}

const validCategories: ProjectCategory[] = [
  'website',
  'mobile',
  'desktop',
  'design',
  'marketing',
  'other',
]

const validStatuses: ProjectStatus[] = [
  'pending',
  'process',
  'approved',
  'rejected',
  'done',
]

export async function createProject(
  supabase: SupabaseClient,
  userId: number,
  body: CreateProjectRequest
): Promise<Project> {
  if (!userId) throw appError('User ID tidak valid', 400)
  if (!body.project_title) throw appError('Project title wajib diisi', 400)
  if (!body.category) throw appError('Category wajib diisi', 400)
  if (!body.description || body.description.length < 100) {
    throw appError('Description minimal 100 karakter', 400)
  }
  if (!body.skills) throw appError('Skills wajib diisi', 400)
  if (!body.contact_name) throw appError('Contact name wajib diisi', 400)
  if (!body.contact_phone) throw appError('Contact phone wajib diisi', 400)
  if (!validCategories.includes(body.category)) {
    throw appError('Category tidak valid', 400)
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      plan_title: body.plan_title || '',
      price_range: body.price_range || '',
      project_title: body.project_title,
      category: body.category,
      description: body.description,
      skills: body.skills,
      contact_name: body.contact_name,
      contact_phone: body.contact_phone,
      additional_notes: body.additional_notes || '',
      status: 'pending' as ProjectStatus,
    })
    .select('*')
    .single()

  if (error) throw appError(error.message, 500)
  return data as Project
}

export async function getMyProjects(
  supabase: SupabaseClient,
  userId: number
): Promise<Project[]> {
  if (!userId) throw appError('User ID tidak valid', 400)

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw appError(error.message, 500)
  return data as Project[]
}

export async function getProjectById(
  supabase: SupabaseClient,
  id: number
): Promise<Project> {
  if (!id) throw appError('Project ID tidak valid', 400)

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw appError(error.message, 404)
  return data as Project
}

export async function getAllProjects(
  supabase: SupabaseClient
): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw appError(error.message, 500)
  return data as Project[]
}

export async function getProjectsByUser(
  supabase: SupabaseClient,
  userId: number
): Promise<Project[]> {
  if (!userId) throw appError('User ID tidak valid', 400)

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw appError(error.message, 500)
  return data as Project[]
}

export async function updateProjectStatus(
  supabase: SupabaseClient,
  id: number,
  status: ProjectStatus
): Promise<Project> {
  if (!id) throw appError('Project ID tidak valid', 400)
  if (!validStatuses.includes(status)) {
    throw appError('Status project tidak valid', 400)
  }

  const { data, error } = await supabase
    .from('projects')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('deleted_at', null)
    .select('*')
    .single()

  if (error) throw appError(error.message, 500)
  return data as Project
}

export async function deleteProject(
  supabase: SupabaseClient,
  id: number
): Promise<true> {
  if (!id) throw appError('Project ID tidak valid', 400)

  const { error } = await supabase
    .from('projects')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) throw appError(error.message, 500)
  return true
}

export async function updateProjectPrice(
  supabase: SupabaseClient,
  id: number,
  planPriceRange: string
): Promise<Project> {
  if (!id) throw appError('Project ID tidak valid', 400)
  if (!planPriceRange) throw appError('Harga tidak boleh kosong', 400)

  const { data, error } = await supabase
    .from('projects')
    .update({
      plan_price_range: planPriceRange,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('deleted_at', null)
    .select('*')
    .single()

  if (error) throw appError(error.message, 500)
  return data as Project
}