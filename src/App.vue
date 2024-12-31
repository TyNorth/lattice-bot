<template>
  <q-page :class="{ dark: $q.dark.isActive, light: !$q.dark.isActive }">
    <router-view />
  </q-page>
</template>

<script setup>
import { watch } from 'vue'
import { Dark } from 'quasar' // Import Quasar Dark plugin
import { useUserStore } from 'src/stores/userStore'
import { useConversationStore } from 'src/stores/conversationStore'
import { useMemoryStore } from 'src/stores/memoryStore'
import { useProjectStore } from 'src/stores/projectStore'
import { useInstructionStore } from 'src/stores/instructionStore'

// Initialize stores
const userStore = useUserStore()
const conversationStore = useConversationStore()
const memoryStore = useMemoryStore()
const projectStore = useProjectStore()
const instructionStore = useInstructionStore()

// Fetch user and set theme on app load
await userStore.fetchUser()

// Apply user's theme preference or auto-detect
Dark.set(userStore.theme === 'auto' ? 'auto' : userStore.theme === 'dark')

// Watch for changes in theme preference
watch(
  () => userStore.theme,
  (newTheme) => {
    Dark.set(newTheme === 'auto' ? 'auto' : newTheme === 'dark')
  },
)

// Preload user-related data
if (userStore.user) {
  await conversationStore.fetchConversations(userStore.user.id)
  await projectStore.fetchProjects(userStore.user.id)
  await instructionStore.fetchInstructions(userStore.user.id)
}
</script>

<style>
/* Example styles for light and dark modes */
.light {
  background-color: #f9f9f9;
  color: #000;
}

.dark {
  background-color: #121212;
  color: #fff;
}
</style>
