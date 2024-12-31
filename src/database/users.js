import { supabase } from 'src/boot/supabase'

export const getUserById = async (userId) => {
  const { data, error } = await supabase.from('auth.users').select('*').eq('id', userId).single()

  if (error) throw new Error(error.message)
  return data
}

export const updateUserTheme = async (userId, theme) => {
  const { data, error } = await supabase.from('auth.users').update({ theme }).eq('id', userId)

  if (error) throw new Error(error.message)
  return data
}

export const updateUserLastLogin = async (userId) => {
  const { data, error } = await supabase
    .from('auth.users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  return data
}
