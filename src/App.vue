<template>
  <div :class="{ dark: $q.dark.isActive, light: !$q.dark.isActive }">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { Dark } from 'quasar' // Import Quasar Dark plugin
import { useUserStore } from 'src/stores/userStore'
import { useConversationStore } from 'src/stores/conversationStore'
import { useProjectStore } from 'src/stores/projectStore'
import { useInstructionStore } from 'src/stores/instructionStore'

// Initialize stores
const userStore = useUserStore()
const conversationStore = useConversationStore()
const projectStore = useProjectStore()
const instructionStore = useInstructionStore()

const user = ref(null)

onMounted(async () => {
  try {
    // Initialize user store and set up authentication listener
    const cleanupAuthListener = await userStore.initialize()

    // Preload user-related data if the user is logged in
    user.value = userStore.getUser.id
    Dark.set('auto')
    if (userStore.getUser.id) {
      await conversationStore.fetchConversations(user.value)
      await projectStore.fetchProjects(user.value)
      await instructionStore.fetchInstructions(user.value)
    }

    // Cleanup listener on component unmount
    onUnmounted(() => cleanupAuthListener())
  } catch (error) {
    console.error('Error during initialization:', error)
  }
})

// Watch for changes in theme preference
watch(
  () => userStore.theme,
  (newTheme) => {
    Dark.set(newTheme === 'auto' ? 'auto' : newTheme === 'dark')
  },
)
</script>

<style>
/* Light and dark mode styles */
.light {
  background-color: #f9f9f9;
  color: #000;
}

.dark {
  background-color: #121212;
  color: #fff;
}
</style>
