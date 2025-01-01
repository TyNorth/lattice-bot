import { defineStore } from 'pinia'
import { supabase } from 'src/boot/supabase'
import { updateUserTheme, updateUserLastLogin } from 'src/database/users'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}, // Stores the current user object
    theme: 'auto', // Stores the current theme (default: auto)
  }),

  getters: {
    // Getter to retrieve the current user
    getUser: (state) => state.user,
  },

  actions: {
    // Initialize the store with authentication state listener
    async initialize() {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          this.user = session.user // Set the user when logged in
          this.theme = session.user?.user_metadata?.theme || 'auto'
        } else {
          this.user = null // Clear the user when logged out
          this.theme = 'auto'
        }
      })

      // Cleanup listener on store destruction
      return () => authListener.unsubscribe()
    },
    setUser(user) {
      this.user = user
      this.theme = user?.user_metadata?.theme || 'auto'
    },

    async fetchUser() {
      const { data: user } = await supabase.auth.getUser()
      this.setUser(user)
    },

    // Update the user's theme preference
    async setTheme(theme) {
      if (!this.user) return // No user logged in
      try {
        await updateUserTheme(this.user.id, theme) // Update theme in the database
        this.theme = theme // Update theme in the store
      } catch (error) {
        console.error('Failed to update theme:', error)
      }
    },

    // Update the user's last login timestamp
    async updateLastLogin() {
      if (!this.user) return // No user logged in
      try {
        await updateUserLastLogin(this.user.id) // Update last login in the database
      } catch (error) {
        console.error('Failed to update last login:', error)
      }
    },

    // Logout the current user
    async logout() {
      try {
        await supabase.auth.signOut() // Sign out from Supabase
      } catch (error) {
        console.error('Failed to log out:', error)
      }
    },
  },
})
