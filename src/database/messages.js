import { supabase } from 'src/boot/supabase'

// Fetch messages for a specific conversation
export const getMessagesForConversation = async (conversationId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

// Add a message to a conversation
export const addMessageToConversation = async (conversationId, text) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, text }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
