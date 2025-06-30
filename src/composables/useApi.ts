import { ref, Ref } from 'vue'
import { apiService } from '../services/api'

interface UseApiState<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
}

export function useApi<T>(): UseApiState<T> & {
  execute: (apiCall: () => Promise<T>) => Promise<T | null>
  reset: () => void
} {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null
      const result = await apiCall()
      data.value = result
      return result
    } catch (err: any) {
      error.value = err.message || 'Une erreur est survenue'
      console.error('API Error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

// Hook spécialisé pour l'authentification
export function useAuth() {
  const api = useApi<any>()

  const login = (email: string, password: string) => {
    return api.execute(() => apiService.login(email, password))
  }

  const register = (userData: any) => {
    return api.execute(() => apiService.register(userData))
  }

  const getProfile = () => {
    return api.execute(() => apiService.getProfile())
  }

  return {
    ...api,
    login,
    register,
    getProfile
  }
}

// Hook spécialisé pour les propriétés
export function useProperties() {
  const api = useApi<any>()

  const getProperties = (filters?: any) => {
    return api.execute(() => apiService.getProperties(filters))
  }

  const getPropertyById = (id: string) => {
    return api.execute(() => apiService.getPropertyById(id))
  }

  const createProperty = (propertyData: any) => {
    return api.execute(() => apiService.createProperty(propertyData))
  }

  const updateProperty = (id: string, propertyData: any) => {
    return api.execute(() => apiService.updateProperty(id, propertyData))
  }

  const deleteProperty = (id: string) => {
    return api.execute(() => apiService.deleteProperty(id))
  }

  return {
    ...api,
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
  }
}
