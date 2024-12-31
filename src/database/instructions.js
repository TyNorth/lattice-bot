import { supabase } from 'src/boot/supabase'

export const getUserInstructions = async (userId) => {
  const { data, error } = await supabase
    .from('instructions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export const addInstruction = async (userId, content) => {
  const { data, error } = await supabase
    .from('instructions')
    .insert([{ user_id: userId, content }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteInstruction = async (instructionId) => {
  const { data, error } = await supabase.from('instructions').delete().eq('id', instructionId)

  if (error) throw new Error(error.message)
  return data
}
