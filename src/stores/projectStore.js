import { defineStore } from 'pinia'
import { getUserProjects, createProject, deleteProject } from 'src/database/projects'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
  }),
  actions: {
    async fetchProjects(userId) {
      this.projects = await getUserProjects(userId)
    },
    async createProject(userId, name) {
      const newProject = await createProject(userId, name)
      this.projects.unshift(newProject)
      this.currentProject = newProject
    },
    async deleteProject(projectId) {
      await deleteProject(projectId)
      this.projects = this.projects.filter((proj) => proj.id !== projectId)
      if (this.currentProject?.id === projectId) {
        this.currentProject = null
      }
    },
    setCurrentProject(projectId) {
      this.currentProject = this.projects.find((proj) => proj.id === projectId)
    },
  },
})
