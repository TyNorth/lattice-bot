import { defineStore } from 'pinia'
import {
  getUserInstructions,
  addInstruction,
  deleteInstruction,
  updateInstruction,
} from 'src/database/instructions'

export const useInstructionStore = defineStore('instruction', {
  state: () => ({
    instructions: {},
    instructionId: null,
  }),
  actions: {
    async fetchInstructions(userId) {
      this.instructions = await getUserInstructions(userId)
      this.instructionId = this.instructions.id
    },
    async addInstruction(userId, content) {
      const newInstruction = await addInstruction(userId, content)
      this.instructions = newInstruction
      this.instructionId = this.instructions.id
    },
    async deleteInstruction(instructionId) {
      await deleteInstruction(instructionId)
      this.instructions = {}
    },
    async updateInstruction(instructionId, content) {
      this.instructions = await updateInstruction(instructionId, content)
      this.instructionId = this.instructions.id
    },
  },
})
