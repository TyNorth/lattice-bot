import { defineStore } from 'pinia'
import { getConversationMemory, addMemory, searchMemory } from 'src/database/memory'

export const useMemoryStore = defineStore('memory', {
  state: () => ({
    memory: [],
    currentConversationId: null,
  }),
  actions: {
    async fetchMemory(conversationId) {
      this.memory = await getConversationMemory(conversationId)
      this.currentConversationId = conversationId
    },
    async addToMemory(conversationId, content, embedding) {
      const newMemory = await addMemory(conversationId, content, embedding)
      this.memory.unshift(newMemory)
    },
    async searchMemory(queryEmbedding, similarityThreshold = 0.8) {
      if (!this.currentConversationId) return []
      return await searchMemory(this.currentConversationId, queryEmbedding, similarityThreshold)
    },
  },
})
