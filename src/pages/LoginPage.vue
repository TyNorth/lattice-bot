<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <img src="/logo.png" alt="MindLink AI Logo" class="logo" />
        <h1 class="title">MindLink AI</h1>
        <p class="subtitle">Streamline your conversations with intelligent memory.</p>

        <q-form @submit="handleLogin">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            outlined
            dense
            required
            class="form-input"
          />
          <q-input
            v-model="password"
            type="password"
            label="Password"
            outlined
            dense
            required
            class="form-input"
          />

          <q-btn type="submit" label="Login" color="primary" :loading="loading" class="login-btn" />

          <q-btn
            label="Forgot Password?"
            flat
            color="secondary"
            @click="handleForgotPassword"
            class="forgot-password-btn"
          />
        </q-form>

        <p class="agreement">
          By logging in, you agree to our
          <a href="/terms" target="_blank">Terms</a> and
          <a href="/privacy" target="_blank">Privacy Policy</a>.
        </p>
      </div>

      <footer class="login-footer">
        <span>Version 1.0</span> | <span>Powered by Quasar + Supabase</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'
import { notifySuccess, notifyError } from 'src/utils/notify'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/userStore'

const userStore = useUserStore() // Access the user store

// Form fields
const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

// Quasar utility for notifications
const $q = useQuasar()

const handleLogin = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      notifyError(error.message)
    } else {
      // Update the user store with the logged-in user
      console.log(data.user)
      userStore.setUser(data.user)
      notifySuccess('Login successful!')
      // Redirect to main page (or dashboard)
      router.push('/chat')
    }
  } catch (err) {
    console.error('Error during login:', err)
    notifyError('An unexpected error occurred. Please try again later.')
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!email.value) {
    $q.notify({
      type: 'warning',
      message: 'Please enter your email address to reset your password.',
    })
    return
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value)

    if (error) {
      $q.notify({
        type: 'negative',
        message: error.message,
      })
    } else {
      $q.notify({
        type: 'positive',
        message: 'Password reset email sent! Check your inbox.',
      })
    }
  } catch (err) {
    console.error('Error during password reset:', err)
    $q.notify({
      type: 'negative',
      message: 'An unexpected error occurred. Please try again later.',
    })
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #4caf50; // Primary brand color
$secondary-color: #9e9e9e; // Secondary color for accents
$text-color: #212121; // Main text color
$background-color: #f5f5f5; // Light background
$dark-mode-bg: #121212; // Dark mode background

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--q-page-background);
  transition: background-color 0.3s ease;

  &.dark {
    background-color: $dark-mode-bg;
  }
}

.login-container {
  width: 100%;
  max-width: 480px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: var(--q-surface);
  text-align: center;
  transition:
    box-shadow 0.3s ease,
    background 0.3s ease;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
}

.logo {
  width: 100px;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.8rem;
  color: $primary-color;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: $secondary-color;
  margin-bottom: 2rem;
}

.form-input {
  margin-bottom: 1.5rem;

  input {
    color: $text-color;
    font-size: 0.95rem;
  }
}

.login-btn {
  margin-top: 1rem;
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  background: $primary-color;
  color: #fff;
}

.forgot-password-btn {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: $secondary-color;
}

.agreement {
  font-size: 0.75rem;
  color: $secondary-color;
  margin-top: 1.5rem;

  a {
    color: $primary-color;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.login-footer {
  font-size: 0.8rem;
  color: $secondary-color;
  margin-top: 2rem;
}
</style>
