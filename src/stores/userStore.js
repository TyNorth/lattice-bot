import { defineStore } from 'pinia'
import { getUserById, updateUserTheme, updateUserLastLogin } from 'src/database/users'
import { supabase } from 'src/boot/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    theme: 'auto',
  }),
  actions: {
    async fetchUser() {
      const { data: user } = await supabase.auth.getUser()
      if (user) {
        this.user = await getUserById(user.id)
        this.theme = this.user?.theme || 'auto'
      }
    },
    async setTheme(theme) {
      if (!this.user) return
      await updateUserTheme(this.user.id, theme)
      this.theme = theme
    },
    async updateLastLogin() {
      if (this.user) {
        await updateUserLastLogin(this.user.id)
      }
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.theme = 'auto'
    },
  },
})
