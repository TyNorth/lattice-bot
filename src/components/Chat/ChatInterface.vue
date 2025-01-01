<template>
  <div class="chat-interface">
    <ChatHeader
      :title="currentConversation?.title || 'New Conversation'"
      @toggleSidebar="$emit('toggleSidebar')"
      @deleteConversation="deleteConversation"
    />
    <ChatMessages :messages="currentConversation?.messages || []" />
    <ChatInput @sendMessage="sendMessage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import axios from 'axios'
import ChatHeader from './ChatHeader.vue'
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import { useConversationStore } from 'src/stores/conversationStore'
import { useUserStore } from 'src/stores/userStore'
import { showConfirmDialog } from 'src/utils/dialog'
import { notifySuccess } from 'src/utils/notify'

const userStore = useUserStore()
// Get conversation data from the store
const conversationStore = useConversationStore()
const currentConversation = computed(() => conversationStore.currentConversation)

// Backend API URL
const BACKEND_API_URL = 'http://127.0.0.1:8000/api/generate/'

// Handle sending a new message
const sendMessage = async (message) => {
  if (!currentConversation.value) {
    // Start a new conversation if none exists
    await conversationStore.startConversation(userStore.getUser.id, 'New Conversation')
  }

  // Add user message to the conversation
  await conversationStore.addMessage(currentConversation.value.id, {
    text: message,
    sender: 'user',
  })

  // Prepare payload for the backend
  const payload = {
    message,
    context: currentConversation.value.messages
      .map((msg) => (msg.sender === 'user' ? `User: ${msg.text}` : `AI: ${msg.text}`))
      .join('\n'),
  }

  try {
    // Send the user message to the backend and fetch the AI response
    const response = await axios.post(BACKEND_API_URL, payload)

    // Add AI response to the conversation
    if (response.data?.choices?.[0]?.message?.content) {
      await conversationStore.addMessage(currentConversation.value.id, {
        text: response.data.choices[0].message.content,
        sender: 'ai',
      })
    }
  } catch (error) {
    console.error('Error communicating with the backend:', error)
    await conversationStore.addMessage(currentConversation.value.id, {
      text: 'Error: Unable to fetch AI response.',
      sender: 'ai',
    })
  }
}

// Handle deleting the current conversation
// Handle deleting the current conversation
const deleteConversation = async () => {
  if (!currentConversation.value) return

  try {
    // Show confirmation dialog
    await showConfirmDialog({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this conversation? This action cannot be undone.',
    })

    // Proceed with deletion
    await conversationStore.deleteConversation(currentConversation.value.id)
    notifySuccess('Deletion succesful')
  } catch {
    console.log('Deletion cancelled by user.')
  }
}
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--q-page-background);
}

/* Add class to control sidebar visibility */
.with-sidebar {
  padding-left: 280px; /* Adjust based on sidebar width */
  transition: padding-left 0.3s ease;
}

.without-sidebar {
  padding-left: 0;
  transition: padding-left 0.3s ease;
}
</style>
