import axios from 'axios'

const BACKEND_API_URL = 'http://127.0.0.1:8000/api'

export const saveMemory = async (conversationId, content, embedding) => {
  const response = await axios.post(`${BACKEND_API_URL}/save_memory`, {
    conversation_id: conversationId,
    content,
    embedding,
  })
  return response.data
}

export const updateMemory = async (memoryId, newContent) => {
  const response = await axios.post(`${BACKEND_API_URL}/update_memory`, {
    id: memoryId,
    content: newContent,
  })
  return response.data
}

export const retrieveMemory = async (conversationId, queryEmbedding, similarityThreshold = 0.8) => {
  const response = await axios.post(`${BACKEND_API_URL}/retrieve_memory`, {
    conversation_id: conversationId,
    query_embedding: queryEmbedding,
    similarity_threshold: similarityThreshold,
  })
  return response.data
}
