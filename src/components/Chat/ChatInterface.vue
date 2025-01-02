<template>
  <div class="chat-interface">
    <ChatHeader
      :title="currentConversation?.title || 'New Conversation'"
      @toggleSidebar="$emit('toggleSidebar')"
      @deleteConversation="deleteConversation"
    />

    <div v-if="!hasMessages" class="empty-state">
      <img
        src="/assets/empty-state-illustration.svg"
        alt="Start a conversation"
        class="illustration"
      />
      <h2 class="empty-title">Start Your Conversation</h2>
      <p class="empty-description">
        This space is waiting for your words. Begin by asking a question, exploring an idea, or
        seeking advice. Not sure what to say?
      </p>
      <div class="suggestions">
        <div class="buttons">
          <q-btn
            outline
            color="primary"
            class="suggestion-btn"
            :label="dynamicSuggestion('What are some creative ideas for [your topic]?')"
            @click="
              sendSuggestion(dynamicSuggestion('What are some creative ideas for [your topic]?'))
            "
          />
          <q-btn
            outline
            color="secondary"
            class="suggestion-btn"
            :label="dynamicSuggestion('Can you help me brainstorm solutions for [problem]?')"
            @click="
              sendSuggestion(
                dynamicSuggestion('Can you help me brainstorm solutions for [problem]?'),
              )
            "
          />
          <q-btn
            outline
            color="accent"
            class="suggestion-btn"
            :label="dynamicSuggestion('Tell me an interesting fact about [topic].')"
            @click="sendSuggestion(dynamicSuggestion('Tell me an interesting fact about [topic].'))"
          />
        </div>
      </div>
    </div>

    <ChatMessages
      v-else
      :messages="currentConversation?.messages || []"
      :conversationId="currentConversation.id"
    />
    <ChatInput @sendMessage="sendMessage" />
    <!-- Context Menu -->
    <div v-if="showContextMenu" :style="contextMenuPosition" class="context-menu">
      <button @click="saveHighlightedText">Save to Memory</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
import ChatHeader from './ChatHeader.vue'
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import { useConversationStore } from 'src/stores/conversationStore'
import { useUserStore } from 'src/stores/userStore'
import { showConfirmDialog } from 'src/utils/dialog'
import { notifySuccess } from 'src/utils/notify'
import { useMemoryStore } from 'src/stores/memoryStore'
import { useInstructionStore } from 'src/stores/instructionStore'

const memoryStore = useMemoryStore()
const instructionStore = useInstructionStore()

// Predefined lists of topics and problems
const topics = [
  'artificial intelligence',
  'climate change',
  'creative writing',
  'mental health',
  'fitness goals',
]
const problems = [
  'time management',
  'procrastination',
  'team collaboration issues',
  'lack of motivation',
  'writer’s block',
]

// State for context menu

const showContextMenu = ref(false)
const contextMenuPosition = ref({ top: '0px', left: '0px' })
const highlightedText = ref('')

// Handle text selection
const handleTextSelection = (event) => {
  const selectedText = window.getSelection()?.toString().trim()
  if (selectedText) {
    highlightedText.value = selectedText
    showContextMenu.value = true
    contextMenuPosition.value = {
      top: `${event.pageY}px`,
      left: `${event.pageX}px`,
    }
  } else {
    showContextMenu.value = false
  }
}

const embedding = ref()

// Save highlighted text to memory
const saveHighlightedText = async () => {
  if (!highlightedText.value) return

  embedding.value = await computeEmbedding(highlightedText.value)
  try {
    // Hide the context menu
    showContextMenu.value = false
    await memoryStore.addToMemory(
      currentConversation.value.id,
      highlightedText.value,
      embedding.value,
    )
    notifySuccess('Saved To memory!')
  } catch {
    console.log('Error')
  }

  // Hide the context menu
  showContextMenu.value = false
}

// Compute embeddings for text (dummy function)
// Compute embeddings for text (connect to backend API)
const computeEmbedding = async (text) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/compute_embedding/', { text })
    return response.data.embedding
  } catch (error) {
    console.error('Error computing embedding:', error)
    return []
  }
}

// Function to get a random item from a list
const getRandomItem = (list) => list[Math.floor(Math.random() * list.length)]

// Function to replace placeholders dynamically
const dynamicSuggestion = (template) => {
  return template
    .replace('[your topic]', getRandomItem(topics))
    .replace('[problem]', getRandomItem(problems))
    .replace('[topic]', getRandomItem(topics))
}

const userStore = useUserStore()
// Get conversation data from the store
const conversationStore = useConversationStore()
const currentConversation = computed(() => conversationStore.currentConversation)

// Check if there are messages in the current conversation
const hasMessages = computed(() => {
  return currentConversation.value?.messages?.length > 0
})

// Backend API URL
const BACKEND_API_URL = 'http://127.0.0.1:8000/api/generate/'

// Handle sending a suggestion
const sendSuggestion = (suggestion) => {
  sendMessage(suggestion)
}

// Similarity search for relevant memories
const fetchSimilarMemories = async (query) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/retrieve_similar_memories/', {
      conversation_id: currentConversation.value.id,
      query_embedding: computeEmbedding(query),
    })

    return response.data || []
  } catch (error) {
    console.error('Error fetching similar memories:', error)
    return []
  }
}

// Enhanced message sending with memory retrieval
const sendMessage = async (message) => {
  console.log('message', message)
  if (!currentConversation.value) {
    await conversationStore.startConversation(userStore.getUser.id, 'New Conversation')
  }

  const userMessage = { text: message, sender: 'user' }
  await conversationStore.addMessage(currentConversation.value.id, userMessage)
  const specialInstructions = instructionStore.instructions
  // Fetch similar memories
  //const similarMemories = await fetchSimilarMemories(message)
  //const memoryContext = similarMemories.map((mem) => mem.content).join('\n')
  const memoryContext = ''
  // Backend payload
  const payload = {
    message,
    context: `${memoryContext}\n${currentConversation.value.messages.map((msg) => msg.text).join('\n')}`,
    specialInstructions,
  }

  try {
    const response = await axios.post(BACKEND_API_URL, payload)
    const aiMessage = {
      text: response.data?.choices?.[0]?.message?.content || 'Error in response',
      sender: 'ai',
    }
    await conversationStore.addMessage(currentConversation.value.id, aiMessage)
  } catch (error) {
    console.error('Error communicating with backend:', error)
    await conversationStore.addMessage(currentConversation.value.id, {
      text: 'Error: Unable to fetch response',
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

onMounted(async () => {
  document.addEventListener('mouseup', handleTextSelection)
  try {
    await instructionStore.fetchInstructions(userStore.user.id)
  } catch (e) {
    console.log('error fetching instructions', e)
  }
})
</script>

<style scoped>
/* Add class to control sidebar visibility */
.with-sidebar {
  padding-left: 280px; /* Adjust based on sidebar width */
  transition: padding-left 0.3s ease;
}

.without-sidebar {
  padding-left: 0;
  transition: padding-left 0.3s ease;
}

.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--q-page-background);
  padding: 1rem;
}

.empty-state {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--q-color-grey-6);

  p {
    margin: 0.5rem 0;
  }

  ul {
    margin-top: 1rem;
    list-style: disc;
    text-align: left;
    color: var(--q-color-grey-8);
  }
}

.empty-description {
  font-size: 1rem;
  margin: 0.5rem 0 1.5rem;
  line-height: 1.5;
}

.suggestions {
  text-align: center;
  margin-top: 1.5rem;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: var(--q-color-grey-9);
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;

    .suggestion-btn {
      font-size: 0.9rem;
      text-transform: none;
      padding: 0.5rem 1rem;
      border: 1px solid;
    }
  }
}

.illustration {
  max-width: 200px;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: var(--q-color-primary);
}

.context-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 4px;
  z-index: 1000;
}

.context-menu button {
  background-color: var(--q-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.context-menu button:hover {
  background-color: var(--q-primary-dark);
}
</style>
