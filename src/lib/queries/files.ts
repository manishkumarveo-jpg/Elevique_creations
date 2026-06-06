import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database'

type FileRow = Database['public']['Tables']['files']['Row']
type FolderRow = Database['public']['Tables']['folders']['Row']

export type FileWithMeta = FileRow & {
  uploader?: { full_name: string } | null
  folder?: { id: string; name: string; icon: string | null } | null
}

export async function getFoldersForProject(projectId: string): Promise<FolderRow[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order')
  if (error) throw error
  return data
}

export async function getFilesForFolder(folderId: string): Promise<FileWithMeta[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('folder_id', folderId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as FileWithMeta[]
}

export async function getFilesForProject(projectId: string): Promise<FileWithMeta[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as FileWithMeta[]
}
