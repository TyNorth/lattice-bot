import { supabase } from 'src/boot/supabase'

export const getUserProjects = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export const createProject = async (userId, name) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ user_id: userId, name }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteProject = async (projectId) => {
  const { data, error } = await supabase.from('projects').delete().eq('id', projectId)

  if (error) throw new Error(error.message)
  return data
}
