import { defineStore } from 'pinia'
import { getUserInstructions, addInstruction, deleteInstruction } from 'src/database/instructions'

export const useInstructionStore = defineStore('instruction', {
  state: () => ({
    instructions: [],
  }),
  actions: {
    async fetchInstructions(userId) {
      this.instructions = await getUserInstructions(userId)
    },
    async addInstruction(userId, content) {
      const newInstruction = await addInstruction(userId, content)
      this.instructions.unshift(newInstruction)
    },
    async deleteInstruction(instructionId) {
      await deleteInstruction(instructionId)
      this.instructions = this.instructions.filter((inst) => inst.id !== instructionId)
    },
  },
})
