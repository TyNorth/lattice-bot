<template>
  <div class="chat-input">
    <q-input
      rounded
      v-model="message"
      placeholder="Type your message..."
      outlined
      dense
      clearable
      class="input-box"
      @keyup.enter="handleSend"
    />
    <q-btn flat icon="sym_o_send" @click="handleSend" color="accent" class="send-btn" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Define the emit event for parent communication
const emit = defineEmits(['sendMessage'])

// Reactive message input
const message = ref('')

// Handle message send
const handleSend = () => {
  if (message.value.trim()) {
    emit('sendMessage', message.value.trim()) // Emit the event with the message
    message.value = '' // Clear the input
  }
}
</script>

<style scoped lang="scss">
.chat-input {
  display: flex;
  padding: 1rem;
  background-color: var(--q-surface);
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.input-box {
  flex-grow: 1;
}

.send-btn {
  margin-left: 1rem;
}
</style>
