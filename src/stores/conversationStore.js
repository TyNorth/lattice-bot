import { defineStore } from 'pinia'
import {
  getUserConversations,
  createConversation,
  deleteConversation,
} from 'src/database/conversations'

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [],
    currentConversation: null,
  }),
  actions: {
    async fetchConversations(userId) {
      this.conversations = await getUserConversations(userId)
    },
    async startConversation(userId, title) {
      const newConversation = await createConversation(userId, title)
      this.conversations.unshift(newConversation)
      this.currentConversation = newConversation
    },
    async deleteConversation(conversationId) {
      await deleteConversation(conversationId)
      this.conversations = this.conversations.filter((conv) => conv.id !== conversationId)
      if (this.currentConversation?.id === conversationId) {
        this.currentConversation = null
      }
    },
    setCurrentConversation(conversationId) {
      this.currentConversation = this.conversations.find((conv) => conv.id === conversationId)
    },
  },
})
