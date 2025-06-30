import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiService from '../services/api'
import type { AdminStats, DashboardStats } from '../types'

export const useStatsStore = defineStore('stats', () => {
  const adminStats = ref<AdminStats | null>(null)
  const dashboardStats = ref<DashboardStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAdminStats = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await apiService.getAdminStats()
      adminStats.value = data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des statistiques'
      console.error('Erreur fetchAdminStats:', err)
      
      // Fallback avec des données mockées si l'endpoint n'existe pas
      adminStats.value = {
        totalUsers: 150,
        totalProperties: 45,
        totalMessages: 320,
        recentActivity: [
          { action: 'Nouvelle propriété ajoutée', user: 'Jean Dupont', time: '2025-06-30T10:30:00Z' },
          { action: 'Message envoyé', user: 'Marie Martin', time: '2025-06-30T09:15:00Z' },
          { action: 'Propriété vendue', user: 'Pierre Durand', time: '2025-06-30T08:45:00Z' }
        ],
        propertyByType: {
          'Appartement': 25,
          'Maison': 15,
          'Villa': 5
        },
        salesByMonth: [
          { month: 'Jan', sales: 12 },
          { month: 'Fév', sales: 15 },
          { month: 'Mar', sales: 18 },
          { month: 'Avr', sales: 22 },
          { month: 'Mai', sales: 19 },
          { month: 'Juin', sales: 25 }
        ]
      }
    } finally {
      loading.value = false
    }
  }

  const fetchDashboardStats = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Pour l'instant, on utilise des données mockées
      // Cela pourrait être remplacé par un appel API spécifique
      dashboardStats.value = {
        totalViews: 1250,
        totalLikes: 89,
        totalMessages: 45,
        recentMessages: [],
        propertiesStats: {
          total: 12,
          available: 8,
          sold: 3,
          rented: 1
        },
        properties: {
          totalProperties: 12,
          totalSales: 3,
          totalRentals: 1,
          monthlyData: []
        },
        users: {
          totalUsers: 0,
          newUsersThisMonth: 0,
          activeUsers: 0,
          totalOwners: 0,
          totalClients: 0
        },
        revenue: {
          totalRevenue: 0,
          monthlyRevenue: 0
        }
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des statistiques'
      console.error('Erreur fetchDashboardStats:', err)
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    adminStats,
    dashboardStats,
    loading,
    error,
    fetchAdminStats,
    fetchDashboardStats,
    clearError
  }
})
