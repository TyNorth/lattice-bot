import { supabase } from 'src/boot/supabase'

export const getConversationMemory = async (conversationId) => {
  const { data, error } = await supabase
    .from('memory')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export const addMemory = async (conversationId, content, embedding) => {
  const { data, error } = await supabase
    .from('memory')
    .insert([{ conversation_id: conversationId, content, embedding }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const searchMemory = async (conversationId, queryEmbedding, similarityThreshold = 0.8) => {
  const { data, error } = await supabase.rpc('search_embeddings', {
    conversation_id: conversationId,
    query_embedding: queryEmbedding,
    similarity_threshold: similarityThreshold,
  })

  if (error) throw new Error(error.message)
  return data
}
