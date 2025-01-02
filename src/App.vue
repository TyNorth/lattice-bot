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

// Function to update theme attribute dynamically
const updateTheme = () => {
  document.body.setAttribute('data-theme', Dark.isActive ? 'dark' : 'light')
}

// Watch for changes in $q.dark.isActive
watch(() => Dark.isActive, updateTheme)

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

:root {
  /* Light Theme Scrollbar Colors */
  --scrollbar-thumb: #2c3e50;
  --scrollbar-track: #f5f5f5;
  --scrollbar-thumb-hover: #8e44ad;
  --scrollbar-thumb-active: #7f8c8d;
}

[data-theme='dark'] {
  /* Dark Theme Scrollbar Colors */
  --scrollbar-thumb: #2c3e50;
  --scrollbar-track: #1a1a1a;
  --scrollbar-thumb-hover: #8e44ad;
  --scrollbar-thumb-active: #7f8c8d;
}

[data-theme='light'] {
  /* Light Theme Scrollbar Colors */
  --scrollbar-thumb: #b0bec5;
  --scrollbar-track: #eceff1;
  --scrollbar-thumb-hover: #607d8b;
  --scrollbar-thumb-active: #455a64;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 10px;
  border: 2px solid var(--scrollbar-track);
}

::-webkit-scrollbar-track {
  background-color: var(--scrollbar-track);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

::-webkit-scrollbar-thumb:active {
  background-color: var(--scrollbar-thumb-active);
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}
</style>
