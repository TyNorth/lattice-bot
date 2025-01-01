import { defineStore } from 'pinia'
import {
  getConversationMemory,
  addMemory,
  searchMemory,
  editMemory,
  deleteMemory,
} from 'src/database/memory'

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
    async editMemory(memoryId, newContent) {
      const updatedMemory = await editMemory(memoryId, newContent)

      // Update the local store state
      const memoryIndex = this.memory.findIndex((m) => m.id === memoryId)
      if (memoryIndex !== -1) {
        this.memory[memoryIndex] = updatedMemory
      }
    },
    async deleteMemory(memoryId) {
      await deleteMemory(memoryId)

      // Remove from the local store state
      this.memory = this.memory.filter((m) => m.id !== memoryId)
    },
  },
})
