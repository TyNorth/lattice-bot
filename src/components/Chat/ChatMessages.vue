<template>
  <div class="chat-messages">
    <MessageBubble
      v-for="(message, index) in messages"
      :key="index"
      :message="message.text"
      :conversationId="props.conversationId"
    />
  </div>
</template>

<script setup>
import MessageBubble from './MessageBubble.vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.chat-messages {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: var(--q-page-background);
  gap: 0.5rem; /* Add spacing between messages */
}
</style>
