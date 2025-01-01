<template>
  <div class="chat-page">
    <Sidebar v-if="showSidebar" class="chat-sidebar" :conversations="conversations" />
    <ChatInterface
      class="chat-main"
      @toggleSidebar="toggleSidebar"
      :currentConversation="currentConversation"
    />
  </div>
</template>

<script setup>
import Sidebar from 'src/components/Sidebar/SideBar.vue'
import ChatInterface from 'src/components/Chat/ChatInterface.vue'
import { ref, computed, onMounted } from 'vue'
import { useConversationStore } from 'src/stores/conversationStore'
import { useUserStore } from 'src/stores/userStore'
import { useRouter } from 'vue-router'

const conversationStore = useConversationStore()
const userStore = useUserStore()
const router = useRouter()

const conversations = computed(() => conversationStore.conversations)
const currentConversation = computed(() => conversationStore.currentConversation)
const showSidebar = ref(true)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// Fetch user and conversations on mount
onMounted(async () => {
  const userId = userStore.user?.id
  if (!userId) {
    console.error('No user found. Redirecting to login.')
    router.push('/')
    return // Optionally redirect to login if user is not logged in
  }

  try {
    await conversationStore.fetchConversations(userId)
  } catch (error) {
    console.error('Error fetching conversations:', error)
  }
})
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  height: 100vh;
  background-color: var(--q-page-background);

  .chat-sidebar {
    flex: 0 0 280px;
    border-right: 1px solid var(--q-divider);
    transition: transform 0.3s ease;
  }

  .chat-main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .chat-sidebar {
      transform: translateX(-100%);
    }

    .chat-sidebar.active {
      transform: translateX(0);
    }
  }
}
</style>
