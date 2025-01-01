<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>Conversations</h2>
      <q-btn
        icon="sym_o_add"
        flat
        color="primary"
        @click="startNewConversation"
        label="New"
        class="new-conversation-btn"
      />
    </div>
    <div class="conversation-list">
      <q-item
        v-for="conversation in conversations"
        :key="conversation.id"
        clickable
        @click="selectConversation(conversation.id)"
        class="conversation-item"
        :active="conversation.id === currentConversation?.id"
      >
        <q-item-section>
          <div class="conversation-title">{{ conversation.title }}</div>
          <div class="conversation-meta">
            {{ formatDate(conversation.created_at) }}
          </div>
        </q-item-section>
      </q-item>
    </div>

    <!-- Memory Management Section -->
    <div class="memory-management">
      <h2>Memory Management</h2>
      <q-btn
        no-caps
        icon="sym_o_edit"
        outline
        unelevated
        color="secondary"
        label="Edit Memories"
        @click="openMemoryDialog"
        class="edit-memory-btn"
      />
    </div>

    <!-- Memory Dialog -->
    <q-dialog v-model="showMemoryDialog">
      <q-card>
        <q-card-section>
          <h3>Memories for {{ currentConversation?.title || 'this conversation' }}</h3>
        </q-card-section>
        <q-card-section>
          <div v-if="memoryList.length === 0" class="empty-memories">
            No memories found for this conversation.
          </div>
          <div v-for="memory in memoryList" :key="memory.id" class="memory-item">
            <q-input
              v-model="memory.content"
              outlined
              dense
              label="Edit Memory"
              @blur="updateMemory(memory.id, memory.content)"
            />
            <q-btn
              flat
              icon="sym_o_delete"
              color="negative"
              @click="deleteMemory(memory.id)"
              class="delete-memory-btn"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" @click="closeMemoryDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useConversationStore } from 'src/stores/conversationStore'
import { useUserStore } from 'src/stores/userStore'
import { useMemoryStore } from 'src/stores/memoryStore'
// Get the conversation store
const conversationStore = useConversationStore()
const memoryStore = useMemoryStore()
const userStore = useUserStore()
const userId = ref()

const showMemoryDialog = ref(false)

// Reactive data for conversations and the current conversation
const conversations = computed(() => conversationStore.conversations)
console.log(conversations.value)
const currentConversation = computed(() => conversationStore.currentConversation)

// memory
const memoryList = computed(() => memoryStore.memory)

// Create a new conversation
const startNewConversation = async () => {
  await conversationStore.startConversation(userId.value, 'New Conversation')
}

// Select a conversation
const selectConversation = async (conversationId) => {
  await conversationStore.setCurrentConversation(conversationId)
}

// Format the date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Methods for memory dialog
const openMemoryDialog = async () => {
  if (currentConversation.value) {
    await memoryStore.fetchMemory(currentConversation.value.id)
  }
  showMemoryDialog.value = true
}

const closeMemoryDialog = () => {
  showMemoryDialog.value = false
}

// Methods for updating and deleting memories
const updateMemory = async (memoryId, newContent) => {
  await memoryStore.editMemory(memoryId, newContent)
}

const deleteMemory = async (memoryId) => {
  await memoryStore.deleteMemory(memoryId)
}

onMounted(() => {
  userId.value = userStore.getUser.id
})
</script>

<style scoped lang="scss">
.sidebar {
  width: 280px;
  height: 100vh;
  background-color: var(--q-surface);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: var(--q-primary-light);
    color: var(--q-primary);
    border-bottom: 1px solid var(--q-divider);

    h2 {
      margin: 0;
      font-size: 1.2rem;
    }
  }

  .conversation-list {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .conversation-item {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--q-hover);
    }

    &[active] {
      background-color: var(--q-primary-light);
      color: var(--q-primary);
    }
  }

  .conversation-title {
    font-size: 1rem;
    font-weight: bold;
  }

  .conversation-meta {
    font-size: 0.85rem;
    color: var(--q-color-grey-6);
  }

  .new-conversation-btn {
    font-size: 0.9rem;
    text-transform: none;
  }
}

.memory-management {
  padding: 1rem;
  background-color: var(--q-surface);

  h2 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--q-primary-light);
    color: var(--q-primary);
    border-bottom: 1px solid var(--q-divider);
  }

  .edit-memory-btn {
    width: 100%;
  }
}

.memory-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  q-input {
    flex-grow: 1;
    margin-right: 0.5rem;
  }

  .delete-memory-btn {
    flex-shrink: 0;
  }
}

.empty-memories {
  color: var(--q-color-grey-6);
  text-align: center;
  margin: 1rem 0;
}
</style>
