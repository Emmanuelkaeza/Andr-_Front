import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { 
  User, 
  Property, 
  Message, 
  PropertyFilters, 
  CreatePropertyRequest,
  LoginRequest 
} from '../types'

// Configuration de base de l'API selon le README
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiService {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Intercepteur pour ajouter automatiquement le token JWT
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Intercepteur pour gérer les erreurs de réponse
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Gestion des erreurs réseau
        if (!error.response) {
          console.error('Erreur réseau:', error.message)
          return Promise.reject(new Error('Erreur de connexion au serveur'))
        }

        if (error.response?.status === 401) {
          // Token expiré ou invalide
          this.removeToken()
          // Rediriger vers la page de connexion seulement si on n'y est pas déjà
          if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )

    // Initialiser le token depuis localStorage
    this.token = localStorage.getItem('access_token')
  }

  private getToken(): string | null {
    return this.token || localStorage.getItem('access_token')
  }

  private setToken(token: string): void {
    this.token = token
    localStorage.setItem('access_token', token)
  }

  private removeToken(): void {
    this.token = null
    localStorage.removeItem('access_token')
  }

  // Méthode générique pour les requêtes
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config)
      return response.data
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message)
      
      // Gestion spécifique des erreurs selon le code de statut
      if (error.response?.status === 401) {
        throw new Error('Non autorisé. Veuillez vous reconnecter.')
      } else if (error.response?.status === 403) {
        throw new Error('Accès interdit.')
      } else if (error.response?.status === 404) {
        throw new Error('Ressource non trouvée.')
      } else if (error.response?.status >= 500) {
        throw new Error('Erreur serveur. Veuillez réessayer plus tard.')
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Erreur API')
    }
  }

  // === AUTHENTIFICATION ===
  async login(email: string, password: string): Promise<{ access_token: string }> {
    const response = await this.request<{ access_token: string }>({
      method: 'POST',
      url: '/auth/login',
      data: { email, password }
    })
    
    this.setToken(response.access_token)
    return response
  }

  async register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    role?: 'client' | 'vendeur'
  }): Promise<{ id: string; createdAt: string }> {
    return await this.request({
      method: 'POST',
      url: '/auth/register',
      data: userData
    })
  }

  async getProfile(): Promise<User> {
    return await this.request({
      method: 'GET',
      url: '/auth/profile'
    })
  }

  async updateProfile(profileData: {
    firstName?: string
    lastName?: string
    phoneNumber?: string
  }): Promise<User> {
    return await this.request({
      method: 'PUT',
      url: '/auth/profile',
      data: profileData
    })
  }

  logout(): void {
    this.removeToken()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // === SANTÉ DE L'API ===
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request({
      method: 'GET',
      url: '/health'
    })
  }

  // === PROPRIÉTÉS ===
  async getProperties(filters?: PropertyFilters): Promise<Property[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }

    return this.request({
      method: 'GET',
      url: `/properties${params.toString() ? `?${params.toString()}` : ''}`
    })
  }

  async getPropertyById(id: string): Promise<Property> {
    return this.request({
      method: 'GET',
      url: `/properties/${id}`
    })
  }

  async createProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    return this.request({
      method: 'POST',
      url: '/properties',
      data: propertyData
    })
  }

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    return this.request({
      method: 'PUT',
      url: `/properties/${id}`,
      data: propertyData
    })
  }

  async deleteProperty(id: string): Promise<void> {
    return this.request({
      method: 'DELETE',
      url: `/properties/${id}`
    })
  }

  async getMyProperties(): Promise<Property[]> {
    return this.request({
      method: 'GET',
      url: '/properties/my-properties'
    })
  }

  // === MESSAGES ===
  async getMessages(): Promise<Message[]> {
    return this.request({
      method: 'GET',
      url: '/messages'
    })
  }

  async sendMessage(messageData: {
    content: string
    propertyId: string
    receiverId: string
  }): Promise<Message> {
    return this.request({
      method: 'POST',
      url: '/messages',
      data: messageData
    })
  }

  // === ADMINISTRATION ===
  async getAdminStats(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/admin/stats'
    })
  }

  // === ADMINISTRATION ===
  async createAdmin(adminData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/admin/create-admin',
      data: adminData
    })
  }

  async initializeFirstAdmin(adminData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<any> {
    return this.request({
      method: 'POST',
      url: '/setup/init-admin',
      data: adminData
    })
  }
}

// Instance unique du service API
export const apiService = new ApiService()
export default apiService
