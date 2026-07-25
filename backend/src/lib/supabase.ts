import { createClient } from '@supabase/supabase-js'

export const createSupabase = (url: string, key: string) => {
  return createClient(url, key)
}