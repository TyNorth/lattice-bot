<template>
  <div class="chat-header">
    <span class="sym_o_menu" @click="$emit('toggleSidebar')"></span>
    <h1>{{ title }}</h1>
    <q-btn flat icon="sym_o_delete" @click="$emit('deleteConversation')" color="negative" />
  </div>
</template>

<script setup>
defineProps({
  title: String,
})
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--q-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sym_o_menu {
  cursor: pointer;
  font-size: 24px;
}

h1 {
  flex-grow: 1;
  text-align: center;
  font-size: 1.2rem;
}

.sym_o_delete {
  cursor: pointer;
}
</style>
