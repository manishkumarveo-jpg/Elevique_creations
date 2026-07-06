import { cache } from 'react'
import { createServerClient } from '@/shared/lib/supabase/server'
import type { Database } from '@/shared/lib/types/database'

type FileRow = Database['public']['Tables']['files']['Row']
type FolderRow = Database['public']['Tables']['folders']['Row']

export type FileWithMeta = FileRow & {
  uploader?: { full_name: string } | null
  folder?: { id: string; name: string; icon: string | null } | null
}

export const getFoldersForProject = cache(async (projectId: string): Promise<FolderRow[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order')
  if (error) throw error
  return data
})

const FILE_SELECT = '*, uploader:profiles!files_uploaded_by_fkey(full_name)'

export const getFilesForFolder = cache(async (folderId: string): Promise<FileWithMeta[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('files')
    .select(FILE_SELECT)
    .eq('folder_id', folderId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as FileWithMeta[]
})

export const getFilesForProject = cache(async (projectId: string): Promise<FileWithMeta[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('files')
    .select(FILE_SELECT)
    .eq('project_id', projectId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as FileWithMeta[]
})
