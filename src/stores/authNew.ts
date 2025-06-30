import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '../services/api'
import type { User, LoginRequest } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const isAuthenticated = computed(() => !!currentUser.value && apiService.isAuthenticated())

  const login = async (credentials: LoginRequest) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await apiService.login(credentials.email, credentials.password)
      
      // Récupérer les informations de l'utilisateur après connexion
      await fetchCurrentUser()
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    apiService.logout()
    currentUser.value = null
    error.value = null
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    role?: 'client' | 'vendeur'
  }) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await apiService.register(userData)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur d\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCurrentUser = async () => {
    try {
      if (!apiService.isAuthenticated()) return
      
      const user = await apiService.getProfile()
      // Ajout des propriétés calculées pour compatibilité
      if (user) {
        user.name = `${user.firstName} ${user.lastName}`
        if (!user.avatar) {
          user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
        }
      }
      currentUser.value = user
    } catch (err: any) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err)
      // Si l'utilisateur n'est pas trouvé, on le déconnecte
      logout()
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      loading.value = true
      const updatedUser = await apiService.updateProfile(userData)
      currentUser.value = updatedUser
      return updatedUser
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state from localStorage
  const initAuth = async () => {
    if (apiService.isAuthenticated()) {
      await fetchCurrentUser()
    }
  }

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    initAuth
  }
})
