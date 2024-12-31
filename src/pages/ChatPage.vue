<template>
  <div class="chat-page">
    <Sidebar v-if="showSidebar" class="chat-sidebar" />
    <ChatInterface class="chat-main" @toggleSidebar="toggleSidebar" />
  </div>
</template>

<script setup>
import Sidebar from 'src/components/Sidebar/SideBar.vue'
import ChatInterface from 'src/components/Chat/ChatInterface.vue'
import { ref } from 'vue'

const showSidebar = ref(true)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}
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
