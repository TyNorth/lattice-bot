<template>
  <div class="chat-interface">
    <ChatHeader :title="currentConversation?.title || 'New Conversation'" />
    <ChatMessages :messages="currentConversation?.messages || []" />
    <ChatInput @sendMessage="sendMessage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ChatHeader from './ChatHeader.vue'
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import { useConversationStore } from 'src/stores/conversationStore'

// Get conversation data from the store
const conversationStore = useConversationStore()
const currentConversation = computed(() => conversationStore.currentConversation)

// Handle sending a new message
const sendMessage = async (message) => {
  if (!currentConversation.value) {
    await conversationStore.startConversation('New Conversation')
  }
  await conversationStore.addMessage(currentConversation.value.id, message)
}
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--q-page-background);
}
</style>
