<template>
  <div :class="['message-bubble', messageType]">
    <div class="message-content" v-html="formattedMessage"></div>
    <!-- Toolbar for AI messages -->
    <div v-if="messageType === 'ai-message'" class="toolbar">
      <q-btn
        flat
        dense
        icon="sym_o_content_copy"
        aria-label="Copy"
        class="copy-btn"
        @click="copyMessage"
      >
        <q-tooltip>Copy to clipboard</q-tooltip>
      </q-btn>
      <q-btn
        flat
        dense
        icon="sym_o_network_intelligence_update"
        aria-label="Save to Memory"
        class="copy-btn"
        @click="saveToMemory"
      >
        <q-tooltip>Save to Memory</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { useMemoryStore } from 'src/stores/memoryStore'
import { notifyError, notifySuccess } from 'src/utils/notify'
import { computed } from 'vue'
import { api } from 'src/boot/axios'

const memoryStore = useMemoryStore()
const props = defineProps({
  message: {
    type: String, // Message is a string
    required: true,
  },
  conversationId: {
    type: String,
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

// Copy message to clipboard
const copyMessage = () => {
  if (messageObject.value?.text) {
    navigator.clipboard.writeText(messageObject.value.text).then(
      () => {
        notifySuccess('Message copied to clipboard!')
      },
      (error) => {
        console.error('Error copying message:', error)
        notifyError('Failed to copy message.')
      },
    )
  }
}

const computeEmbedding = async (text) => {
  try {
    const response = await api.post('api/compute_embedding/', { text })
    return response.data.embedding
  } catch (error) {
    console.error('Error computing embedding:', error)
    return []
  }
}

const saveToMemory = async () => {
  if (messageObject.value?.text) {
    navigator.clipboard.writeText(messageObject.value.text).then(
      async () => {
        try {
          let embedding = await computeEmbedding(messageObject.value.text)
          if (embedding) {
            await memoryStore.addToMemory(props.conversationId, messageObject.value.text, embedding)
            notifySuccess('Saved to memory!')
          } else {
            return
          }
        } catch (e) {
          console.log('Error: ', e)
          notifyError('Something went wrong')
        }
      },
      (error) => {
        console.error('Error copying message:', error)
        notifyError('Failed to copy message.')
      },
    )
  }
}
</script>

<style scoped>
.message-bubble {
  max-width: 100%;
  padding: 0.8rem;
  border-radius: 10px;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
}

/* AI messages on the left */
.ai-message {
  align-self: flex-stretch; /* Align to the left */
  background-color: var(--q-surface);
  color: var(--q-text-primary);
  border-top-left-radius: 0; /* Square corner for better distinction */
  text-align: left;
}

/* User messages on the right */
.user-message {
  align-self: flex-end; /* Align the message bubble to the right */
  background-color: var(--q-accent); /* Bubble background color */
  color: #fff; /* Text color */
  border-top-right-radius: 0; /* Square corner for better distinction */
  text-align: center; /* Center-align the text within the bubble */
  padding: 0.8rem; /* Add padding for better spacing */
  padding-bottom: 0px;
  display: flex; /* Use flexbox for alignment */
  justify-content: center; /* Center the text horizontally */
  align-items: center; /* Center the text vertically */
}

/* Toolbar styles */
.toolbar {
  display: flex;
  justify-content: flex-start; /* Align toolbar to the left */
  align-items: center;
  margin-top: 0.5rem;
}

.copy-btn {
  color: var(--q-accent);
  font-size: 0.6rem;
}
</style>
