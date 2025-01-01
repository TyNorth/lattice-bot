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
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useConversationStore } from 'src/stores/conversationStore'
import { useUserStore } from 'src/stores/userStore'

// Get the conversation store
const conversationStore = useConversationStore()
const userStore = useUserStore()
const userId = ref()

// Reactive data for conversations and the current conversation
const conversations = computed(() => conversationStore.conversations)
console.log(conversations.value)
const currentConversation = computed(() => conversationStore.currentConversation)

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
</style>
