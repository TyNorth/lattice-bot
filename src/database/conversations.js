import { supabase } from 'src/boot/supabase'

export const getUserConversations = async (userId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export const createConversation = async (userId, title = 'Untitled Conversation') => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([{ user_id: userId, title }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Update a conversation
export const updateConversation = async (conversationId, updatedFields) => {
  const { data, error } = await supabase
    .from('conversations')
    .update(updatedFields)
    .eq('id', conversationId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteConversation = async (conversationId) => {
  const { data, error } = await supabase.from('conversations').delete().eq('id', conversationId)

  if (error) throw new Error(error.message)
  return data
}
