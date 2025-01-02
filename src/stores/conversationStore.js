import { defineStore } from 'pinia'
import {
  getUserConversations,
  createConversation,
  deleteConversation,
  updateConversation,
} from 'src/database/conversations'
import { addMessageToConversation, getMessagesForConversation } from 'src/database/messages' // Add appropriate database methods

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [], // List of all conversations
    messages: {}, // Cache messages for each conversation

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

    // Update a conversation's details
    async updateConversation(conversationId, updatedFields) {
      try {
        const updatedConversation = await updateConversation(conversationId, updatedFields)

        // Update the conversation in the local state
        const conversationIndex = this.conversations.findIndex((conv) => conv.id === conversationId)
        if (conversationIndex !== -1) {
          this.conversations[conversationIndex] = updatedConversation
        }

        // If the current conversation is the one updated, reflect the changes
        if (this.currentConversation?.id === conversationId) {
          this.currentConversation = { ...this.currentConversation, ...updatedFields }
        }
      } catch (error) {
        console.error('Error updating conversation:', error)
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
    async fetchMessagesForConversation(conversationId) {
      if (!this.messages[conversationId]) {
        try {
          const messages = await getMessagesForConversation(conversationId)
          this.messages[conversationId] = messages.map((msg) => ({
            ...msg,
            text: JSON.parse(msg.text).text, // Parse message text from JSON
          }))
        } catch (error) {
          console.error('Error fetching messages for conversation:', error)
        }
      }
      return this.messages[conversationId]
    },
  },
})
