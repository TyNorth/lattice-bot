import { defineStore } from 'pinia'
import {
  getUserConversations,
  createConversation,
  deleteConversation,
} from 'src/database/conversations'
import { addMessageToConversation, getMessagesForConversation } from 'src/database/messages' // Add appropriate database methods

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [], // List of all conversations
    currentConversation: null, // The currently active conversation
  }),

  actions: {
    // Fetch all conversations for a user
    async fetchConversations(userId) {
      try {
        this.conversations = await getUserConversations(userId)
      } catch (error) {
        console.error('Error fetching conversations:', error)
      }
    },

    // Start a new conversation
    async startConversation(userId, title) {
      try {
        const newConversation = await createConversation(userId, title)
        this.conversations.unshift(newConversation)
        this.currentConversation = { ...newConversation, messages: [] } // Initialize with empty messages
      } catch (error) {
        console.error('Error starting conversation:', error)
      }
    },

    // Delete a conversation
    async deleteConversation(conversationId) {
      try {
        await deleteConversation(conversationId)
        this.conversations = this.conversations.filter((conv) => conv.id !== conversationId)
        if (this.currentConversation?.id === conversationId) {
          this.currentConversation = null // Clear the current conversation if deleted
        }
      } catch (error) {
        console.error('Error deleting conversation:', error)
      }
    },

    // Set the current conversation and fetch its messages
    async setCurrentConversation(conversationId) {
      const selectedConversation = this.conversations.find((conv) => conv.id === conversationId)
      if (!selectedConversation) {
        console.error('Conversation not found:', conversationId)
        return
      }

      try {
        const messages = await getMessagesForConversation(conversationId)
        this.currentConversation = { ...selectedConversation, messages }
      } catch (error) {
        console.error('Error fetching messages for conversation:', error)
      }
    },

    // Add a message to the current conversation
    async addMessage(conversationId, message) {
      if (!this.currentConversation || this.currentConversation.id !== conversationId) {
        console.error('Cannot add message: No active conversation or ID mismatch.')
        return
      }

      try {
        const newMessage = await addMessageToConversation(conversationId, message)
        this.currentConversation.messages.push(newMessage) // Append to current conversation messages
      } catch (error) {
        console.error('Error adding message to conversation:', error)
      }
    },
  },
})
