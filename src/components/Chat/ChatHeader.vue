<template>
  <div class="chat-header">
    <q-btn
      flat
      icon="sym_o_menu"
      @click="$emit('toggleSidebar')"
      color="accent"
      aria-label="Toggle Sidebar"
      ><q-tooltip> Toogle Sidebar </q-tooltip>
    </q-btn>
    <h1>{{ title }}</h1>
    <q-btn
      aria-label="Delete Conversation"
      flat
      icon="sym_o_delete_forever"
      @click="$emit('deleteConversation')"
      color="negative"
      ><q-tooltip> Delete Conversation </q-tooltip>
    </q-btn>
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
  background-color: var(--q-surface);
  box-shadow: 0 2px 4px rgba(1, 60, 119, 0.116);
  border-radius: 8px;
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
