<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>Conversations</h2>
      <q-btn
        icon="sym_o_add_comment"
        flat
        color="accent"
        @click="startNewConversation"
        aria-label="New"
        class="edit-memory-btn"
        ><q-tooltip> New Conversation </q-tooltip>
      </q-btn>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <q-input
        rounded
        dense
        outlined
        v-model="searchQuery"
        placeholder="Search Conversations"
        class="search-input"
        :clearable="true"
        clear-icon="sym_o_clear"
        debounce="300"
        @input="onSearchInput"
      >
        <template v-slot:prepend>
          <q-icon name="sym_o_search" />
        </template>
      </q-input>
    </div>

    <!--Conversations-->
    <div class="conversation-list">
      <q-item
        v-for="conversation in filteredConversations"
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
        <q-item-section side>
          <q-btn
            flat
            icon="sym_o_more_horiz"
            class="menu-btn"
            aria-label="options"
            @click.stop="toggleMenu(conversation.id)"
          >
            <q-menu fit anchor="bottom left" self="top left">
              <q-list class="submenu">
                <q-item class="menu-item" clickable @click="openRenameDialog(conversation.id)">
                  <q-item-section avatar v-ripple
                    ><q-icon name="sym_o_ink_pen" size="xs"
                  /></q-item-section>
                  <q-item-section class="rename-text">Rename</q-item-section>
                </q-item>
                <q-item clickable @click="openDeleteDialog(conversation.id)">
                  <q-item-section avatar v-ripple
                    ><q-icon name="sym_o_delete_forever" color="negative" size="xs"
                  /></q-item-section>
                  <q-item-section class="delete-text">Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-tooltip> Options </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </div>

    <!-- Settings -->
    <div class="settings">
      <div class="settings-header">
        <h2>Settings</h2>
        <q-btn
          no-caps
          icon="sym_o_settings_b_roll"
          unelevated
          flat
          color="accent"
          aria-label="Adjust Settings"
          @click="openSettingsDialog"
          class="edit-memory-btn"
          ><q-tooltip> Adjust Settings </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Memory Management Section -->
    <div class="memory-management">
      <div class="memory-header">
        <h2>Memory</h2>
        <q-btn
          no-caps
          icon="sym_o_network_intelligence_update"
          unelevated
          flat
          color="accent"
          aria-label="Edit Memories"
          @click="openMemoryDialog"
          class="edit-memory-btn"
          ><q-tooltip> Edit Memories </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Memory Dialog -->
    <q-dialog v-model="showMemoryDialog" persistent>
      <q-card class="memory-dialog">
        <q-card-section class="memory-header">
          <h3>Memories for {{ currentConversation?.title || 'this conversation' }}</h3>
        </q-card-section>
        <q-card-section class="memory-content">
          <div v-if="memoryList.length === 0" class="empty-memories">
            <q-icon name="sym_o_info" size="2rem" class="info-icon" />
            <p>No memories found for this conversation.</p>
          </div>
          <div v-for="memory in memoryList" :key="memory.id" class="memory-item">
            <q-input
              rounded
              v-model="memory.content"
              outlined
              dense
              type="textarea"
              label="Edit Memory"
              class="full-width"
              @blur="updateMemory(memory.id, memory.content)"
            />
            <q-btn
              flat
              icon="sym_o_delete"
              color="negative"
              @click="deleteMemory(memory.id)"
              class="delete-memory-btn"
            >
              <q-tooltip>Delete Memory</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="memory-actions">
          <q-btn flat label="Close" color="primary" @click="closeMemoryDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <!-- Rename Dialog -->
  <q-dialog v-model="showRenameDialog" persistent>
    <q-card class="dialog-card">
      <q-card-section class="dialog-header">
        <q-icon name="sym_o_ink_pen" size="2rem" class="dialog-icon" />
        <h3>Rename Conversation</h3>
      </q-card-section>
      <q-card-section class="dialog-body">
        <q-input rounded v-model="renameTitle" label="New Title" outlined dense />
      </q-card-section>
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Cancel" @click="closeRenameDialog" />
        <q-btn flat label="Save" color="accent" @click="renameConversation" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Delete Dialog -->
  <q-dialog v-model="showDeleteDialog" persistent>
    <q-card class="dialog-card">
      <q-card-section class="dialog-header">
        <q-icon name="sym_o_delete_forever" size="2rem" color="negative" class="dialog-icon" />
        <h3>Delete Conversation</h3>
      </q-card-section>
      <q-card-section class="dialog-body">
        <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
      </q-card-section>
      <q-card-actions align="right" class="dialog-actions">
        <q-btn flat label="Cancel" @click="closeDeleteDialog" />
        <q-btn flat label="Delete" color="negative" @click="deleteConversation" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Settings Dialog -->
  <q-dialog v-model="showSettingsDialog" persistent>
    <q-card class="settings-dialog">
      <q-card-section class="settings-header">
        <h3>Special Instructions</h3>
      </q-card-section>
      <q-card-section class="settings-body">
        <q-input
          v-model="specialInstructions"
          type="textarea"
          class="special-instructions-input"
          rows="10"
          outlined
          placeholder="Enter your special instructions here..."
        />
      </q-card-section>
      <q-card-actions align="right" class="settings-actions">
        <q-btn flat label="Cancel" @click="closeSettingsDialog" />
        <q-btn flat label="Save" color="accent" @click="saveSpecialInstructions" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useConversationStore } from 'src/stores/conversationStore'
import { useUserStore } from 'src/stores/userStore'
import { useMemoryStore } from 'src/stores/memoryStore'
import { notifySuccess, notifyError } from 'src/utils/notify'
// Get the conversation store
const conversationStore = useConversationStore()
const memoryStore = useMemoryStore()
const userStore = useUserStore()
const userId = ref()
const searchQuery = ref('') // Holds the search input
const filteredConversations = ref([])
let query

const showSettingsDialog = ref(false)
const specialInstructions = ref('') // Holds the special instructions

// Open the settings dialog
const openSettingsDialog = () => {
  loadSpecialInstructions() // Load current instructions before opening
  showSettingsDialog.value = true
}

// Close the settings dialog
const closeSettingsDialog = () => {
  showSettingsDialog.value = false
}

// Load the current special instructions (stub for now)
const loadSpecialInstructions = () => {
  // Fetch instructions from storage or API
  // Example: Fetch from localStorage for now
  specialInstructions.value = localStorage.getItem('specialInstructions') || ''
}

// Save the special instructions
const saveSpecialInstructions = () => {
  try {
    // Save instructions to storage or API
    // Example: Save to localStorage for now
    localStorage.setItem('specialInstructions', specialInstructions.value)
    notifySuccess('Special instructions saved successfully!')
    closeSettingsDialog()
  } catch (error) {
    notifyError('Failed to save special instructions.', error)
  }
}
// Watch search query and dynamically update the filtered list
const onSearchInput = async () => {
  if (searchQuery.value) {
    query = searchQuery.value.toLowerCase()
  } else {
    query = null
  }

  if (!query) {
    // Reset to all conversations when query is empty
    filteredConversations.value = conversationStore.conversations
    return
  }

  const results = await Promise.all(
    conversationStore.conversations.map(async (conversation) => {
      const titleMatch = conversation.title.toLowerCase().includes(query)

      if (!titleMatch) {
        if (!conversationStore.messages[conversation.id]) {
          const messages = await conversationStore.fetchMessagesForConversation(conversation.id)
          conversationStore.messages[conversation.id] = messages.map((msg) => {
            let parsedText = msg.text
            try {
              // Safely parse the message text if it is valid JSON
              parsedText = JSON.parse(msg.text).text
            } catch (e) {
              // If parsing fails, fallback to the original text
              console.warn(`Failed to parse message text as JSON: ${msg.text}`, e)
            }
            return { ...msg, text: parsedText }
          })
        }

        const messageMatch = conversationStore.messages[conversation.id].some((message) =>
          message.text.toLowerCase().includes(query),
        )

        return messageMatch ? conversation : null
      }

      return conversation
    }),
  )

  // Remove nulls from results and update the list
  filteredConversations.value = results.filter((conversation) => conversation)
}

// Fetch conversations on mounted
onMounted(() => {})

// Dialog states
const showRenameDialog = ref(false)
const showDeleteDialog = ref(false)
const menuOpen = ref({})

// Rename state
const renameTitle = ref('')
let renameConversationId = null

// Delete state
let deleteConversationId = null

const showMemoryDialog = ref(false)

// Toggle menu visibility
const toggleMenu = (id) => {
  menuOpen.value = { ...menuOpen.value, [id]: !menuOpen.value[id] }
}

// Rename conversation
const openRenameDialog = (id) => {
  const conversation = conversations.value.find((conv) => conv.id === id)
  renameTitle.value = conversation?.title || ''
  renameConversationId = id
  showRenameDialog.value = true
}

const closeRenameDialog = () => {
  showRenameDialog.value = false
  renameConversationId = null
  renameTitle.value = ''
}
const renameConversation = async () => {
  if (renameConversationId) {
    try {
      // Call the updateConversation method with the conversation ID and the new title
      await conversationStore.updateConversation(renameConversationId, { title: renameTitle.value })
      console.log('Conversation renamed successfully')
    } catch (error) {
      console.error('Error renaming conversation:', error)
    }
  }
  closeRenameDialog() // Close the rename dialog after updating
}

// Delete conversation
const openDeleteDialog = (id) => {
  deleteConversationId = id
  showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
  showDeleteDialog.value = false
  deleteConversationId = null
}

const deleteConversation = async () => {
  if (deleteConversationId) {
    await conversationStore.deleteConversation(deleteConversationId)
  }
  closeDeleteDialog()
}

// Reactive data for conversations and the current conversation
const conversations = computed(() => conversationStore.conversations)
console.log(conversations.value)
const currentConversation = computed(() => conversationStore.currentConversation)

// memory
const memoryList = computed(() => memoryStore.memory)

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
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
}

// Methods for memory dialog
const openMemoryDialog = async () => {
  if (currentConversation.value) {
    await memoryStore.fetchMemory(currentConversation.value.id)
  }
  showMemoryDialog.value = true
}

const closeMemoryDialog = () => {
  showMemoryDialog.value = false
}

// Methods for updating and deleting memories
const updateMemory = async (memoryId, newContent) => {
  try {
    await memoryStore.editMemory(memoryId, newContent)
    notifySuccess('Memory update Succesful!')
  } catch {
    notifyError('Something went wrong!')
  }
}

const deleteMemory = async (memoryId) => {
  try {
    await memoryStore.deleteMemory(memoryId)
    notifySuccess('Deletion Succesful!')
  } catch {
    notifyError('Something went wrong!')
  }
}

onMounted(async () => {
  userId.value = userStore.getUser.id
  await conversationStore.fetchConversations(userId.value)
  filteredConversations.value = conversationStore.conversations // Default to all conversations
})

watch(searchQuery, onSearchInput)

// Watch the conversation list to reapply filters when it changes
watch(
  () => conversationStore.conversations,
  () => onSearchInput(),
  { deep: true },
)
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

    .edit-memory-btn {
      margin-left: 0.8rem; /* Adds spacing between the button and heading */
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

.memory-management {
  padding: 1rem;
  background-color: var(--q-surface);
  color: var(--q-primary);

  .memory-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
      display: inline-flex;
      align-items: center; /* Ensures alignment with the button */
    }

    .edit-memory-btn {
      margin-left: 0.8rem; /* Adds spacing between the button and heading */
    }
  }
}

.memory-dialog {
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: var(--q-secondary);
  border-radius: 16px; /* Rounded edges for a modern design */
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.memory-content {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;

  .memory-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;

    q-input {
      flex-grow: 1;
    }

    .delete-memory-btn {
      flex-shrink: 0;
    }
  }

  .empty-memories {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--q-color-grey-6);
    text-align: center;

    .info-icon {
      margin-bottom: 0.5rem;
      color: var(--q-primary);
    }

    p {
      margin: 0;
      font-size: 1rem;
    }
  }
}

.memory-actions {
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--q-divider);

  q-btn {
    font-size: 1rem;
  }
}

.dialog-card {
  width: 90%; /* Responsive width */
  max-width: 400px; /* Limit the size */
  border-radius: 16px; /* Modern rounded corners */
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2); /* Subtle shadow for elevation */
  overflow: hidden; /* Prevent overflow of child elements */
  background-color: var(--q-dark); /* Match surface color */
  color: var(--q-text-primary); /* Consistent text color */
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 1rem; /* Space between icon and title */
  padding: 1rem;
  background-color: var(--q-primary-light);
  color: var(--q-primary);
  border-bottom: 1px solid var(--q-divider);

  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .dialog-icon {
    flex-shrink: 0;
  }
}

.dialog-body {
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.5;

  p {
    margin: 0;
    color: var(--q-text-secondary);
  }
}

.dialog-actions {
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--q-divider);

  q-btn {
    font-size: 1rem;
    text-transform: none;
  }
}

.delete-text {
  color: $negative;
  margin-left: -2rem;
}
.rename-text {
  margin-left: -2rem;
}

.search-bar {
  padding: 1rem;
  border-bottom: 1px solid var(--q-divider);
  background-color: var(--q-surface);

  .search-input {
    width: 100%;
  }
}

.conversation-title.highlighted {
  background-color: var(--q-hover);
  border-radius: 4px;
  padding: 2px 4px;
}

.settings {
  padding: 1rem;
  background-color: var(--q-surface);
  color: var(--q-primary);

  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
      display: inline-flex;
      align-items: center; /* Ensures alignment with the button */
    }

    .edit-memory-btn {
      margin-left: 0.5rem; /* Adds spacing between the button and heading */
    }
  }
}

.settings-dialog {
  max-width: 600px;
  width: 100%;
}

.settings-header {
  padding: 1rem;
  background-color: var(--q-primary-light);
  color: var(--q-primary);
  border-bottom: 1px solid var(--q-divider);
  text-align: center;
}

.settings-body {
  padding: 1rem;
}

.special-instructions-input {
  width: 100%;
}

.settings-actions {
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--q-divider);
}
</style>
