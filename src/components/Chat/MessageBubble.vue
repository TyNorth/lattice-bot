<template>
  <div :class="['message-bubble', messageType]">
    <p>{{ message.text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const messageType = computed(() =>
  props.message.sender === 'user' ? 'user-message' : 'ai-message',
)
</script>

<style scoped>
.message-bubble {
  max-width: 70%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border-radius: 10px;
  word-wrap: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: var(--q-primary);
  color: #fff;
}

.ai-message {
  align-self: flex-start;
  background-color: var(--q-surface);
  color: var(--q-text-primary);
}
</style>
