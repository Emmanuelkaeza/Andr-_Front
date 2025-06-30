import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardStats } from '../types'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref<DashboardStats | null>(null)
  const loading = ref(false)

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalViews: 3420,
    totalLikes: 892,
    totalMessages: 45,
    recentMessages: [],
    propertiesStats: {
      total: 156,
      available: 89,
      sold: 35,
      rented: 32
    },
    properties: {
      totalProperties: 156,
      totalSales: 89,
      totalRentals: 67,
      totalViews: 3420,
      totalLikes: 892,
      monthlyData: [
        { month: 'Jan', sales: 12, rentals: 8, views: 450 },
        { month: 'Fev', sales: 19, rentals: 14, views: 520 },
        { month: 'Mar', sales: 15, rentals: 11, views: 480 },
        { month: 'Avr', sales: 22, rentals: 18, views: 610 },
        { month: 'Mai', sales: 18, rentals: 12, views: 580 },
        { month: 'Jun', sales: 25, rentals: 20, views: 720 }
      ]
    },
    users: {
      totalUsers: 1247,
      totalOwners: 312,
      totalClients: 934,
      newUsersThisMonth: 89,
      activeUsers: 456
    },
    revenue: {
      totalRevenue: 2450000,
      monthlyRevenue: 125000,
      projectedRevenue: 2800000
    }
  }

  const fetchStats = async (userType: 'admin' | 'owner' | 'client') => {
    loading.value = true
    
    // Simulate API call
    setTimeout(() => {
      if (userType === 'admin') {
        stats.value = mockStats
      } else if (userType === 'owner') {
        // Filter stats for owner
        stats.value = {
          totalViews: 234,
          totalLikes: 45,
          totalMessages: 12,
          recentMessages: [],
          propertiesStats: {
            total: 8,
            available: 5,
            sold: 2,
            rented: 1
          },
          properties: {
            totalProperties: 8,
            totalSales: 3,
            totalRentals: 5,
            totalViews: 234,
            totalLikes: 45,
            monthlyData: []
          },
          users: {
            totalUsers: 0,
            totalOwners: 0,
            totalClients: 0,
            newUsersThisMonth: 0,
            activeUsers: 12 // Messages/inquiries
          },
          revenue: {
            totalRevenue: 145000,
            monthlyRevenue: 8500,
            projectedRevenue: 180000
          }
        }
      } else {
        // Client stats (minimal)
        stats.value = {
          totalViews: 0,
          totalLikes: 23,
          totalMessages: 5,
          recentMessages: [],
          propertiesStats: {
            total: 0,
            available: 0,
            sold: 0,
            rented: 0
          },
          properties: {
            totalProperties: 0,
            totalSales: 0,
            totalRentals: 0,
            totalViews: 0,
            totalLikes: 23, // Properties liked
            monthlyData: []
          },
          users: {
            totalUsers: 0,
            totalOwners: 0,
            totalClients: 0,
            newUsersThisMonth: 0,
            activeUsers: 5 // Active conversations
          },
          revenue: {
            totalRevenue: 0,
            monthlyRevenue: 0,
            projectedRevenue: 0
          }
        }
      }
      loading.value = false
    }, 1000)
  }

  const getPropertyTypeData = () => {
    if (!stats.value) return []
    return [
      { label: 'Ventes', value: stats.value.properties.totalSales, color: '#10B981' },
      { label: 'Locations', value: stats.value.properties.totalRentals, color: '#3B82F6' }
    ]
  }

  const getUserTypeData = () => {
    if (!stats.value) return []
    return [
      { label: 'Propriétaires', value: stats.value.users.totalOwners, color: '#8B5CF6' },
      { label: 'Clients', value: stats.value.users.totalClients, color: '#F59E0B' }
    ]
  }

  const getMonthlyData = () => {
    if (!stats.value) return []
    return stats.value.properties.monthlyData
  }

  return {
    stats,
    loading,
    fetchStats,
    getPropertyTypeData,
    getUserTypeData,
    getMonthlyData
  }
})
