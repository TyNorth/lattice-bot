<template>
  <div :class="['message-bubble', messageType]" v-html="formattedMessage"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String, // Message is a string
    required: true,
  },
})

// Convert string to object
const messageObject = computed(() => {
  try {
    return JSON.parse(props.message) // Parse the string into an object
  } catch (error) {
    console.error('Invalid JSON string:', error)
    return null // Return null if parsing fails
  }
})

// Determine the type of message (user or AI)
const messageType = computed(() => {
  return messageObject.value?.sender === 'user' ? 'user-message' : 'ai-message'
})

// Parse and format message text
const formattedMessage = computed(() => {
  const rawText = messageObject.value?.text || ''

  // Add custom parsing and formatting logic
  return rawText
    .replace(/^\d+\.\s/gm, '<li>') // Format numbered lists
    .replace(/(.*?):/g, '<strong>$1:</strong>') // Bolden headings or key terms before colons
    .replace(/(?:\r\n|\r|\n)/g, '<br>') // Replace newlines with <br> for proper line breaks
    .replace(/1\.\s([\s\S]*?)(?=\d+\.\s|$)/g, '<ol><li>$1</li></ol>') // Wrap numbered lists in <ol>
    .replace(/^([^\n]+)$/gm, '<p>$1</p>') // Wrap standalone lines in <p> tags for paragraphs
    .trim() // Remove leading/trailing whitespace
})
</script>

<style scoped>
.message-bubble {
  max-width: 70%;
  padding: 0.8rem;
  border-radius: 10px;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
}

/* AI messages on the left */
.ai-message {
  align-self: flex-start; /* Align to the left */
  background-color: var(--q-surface);
  color: var(--q-text-primary);
  border-top-left-radius: 0; /* Square corner for better distinction */
  text-align: left;
}

/* User messages on the right */
.user-message {
  align-self: flex-end; /* Align to the right */
  background-color: var(--q-primary);
  color: #fff;
  border-top-right-radius: 0; /* Square corner for better distinction */
  text-align: right;
}
</style>
