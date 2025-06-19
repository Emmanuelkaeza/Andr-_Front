import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('/api/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (error) {
        throw error
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        const response = await axios.post('/api/register', {
          name,
          email,
          password
        })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await axios.post('/api/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get('/api/user')
        this.user = response.data
      } catch (error) {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        throw error
      }
    }
  }
})
