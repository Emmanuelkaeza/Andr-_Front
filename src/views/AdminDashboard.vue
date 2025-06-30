<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Administrateur
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Vue d'ensemble de la plateforme LeBon Immobilier
            </p>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Dernière mise à jour : {{ new Date().toLocaleString('fr-FR') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Chargement des statistiques...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
        <div class="flex">
          <ExclamationTriangleIcon class="w-5 h-5 text-red-400" />
          <div class="ml-3">
            <p class="text-sm text-red-800 dark:text-red-400">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <UsersIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.totalUsers || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <HomeIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Propriétés</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.totalProperties || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <ChatBubbleLeftRightIcon class="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Messages</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.totalMessages || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <ChartBarIcon class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Activité</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.recentActivity?.length || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Propriétés par type -->
          <ChartComponent
            v-if="propertyTypeChartData"
            title="Propriétés par Type"
            type="doughnut"
            :data="propertyTypeChartData"
          />

          <!-- Ventes par mois -->
          <ChartComponent
            v-if="salesChartData"
            title="Ventes par Mois"
            type="bar"
            :data="salesChartData"
          />
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Activité Récente
            </h3>
          </div>
          <div class="p-6">
            <div v-if="stats?.recentActivity && stats.recentActivity.length > 0" class="space-y-4">
              <div
                v-for="(activity, index) in stats.recentActivity"
                :key="index"
                class="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <BellIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ activity.action }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Par {{ activity.user }} • {{ formatDate(activity.time) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucune activité récente
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  UsersIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BellIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useStatsStore } from '../stores/stats'
import ChartComponent from '../components/ChartComponent.vue'

const statsStore = useStatsStore()

const loading = computed(() => statsStore.loading)
const error = computed(() => statsStore.error)
const stats = computed(() => statsStore.adminStats)

const propertyTypeChartData = computed(() => {
  if (!stats.value?.propertyByType) return null
  
  const types = Object.keys(stats.value.propertyByType)
  const values = Object.values(stats.value.propertyByType)
  
  return {
    labels: types,
    datasets: [
      {
        label: 'Nombre de propriétés',
        data: values,
        backgroundColor: [
          'rgb(59, 130, 246)', // blue-500
          'rgb(16, 185, 129)', // green-500
          'rgb(245, 101, 101)', // red-500
          'rgb(251, 191, 36)', // yellow-500
          'rgb(139, 92, 246)', // purple-500
        ],
        borderWidth: 0
      }
    ]
  }
})

const salesChartData = computed(() => {
  if (!stats.value?.salesByMonth) return null
  
  return {
    labels: stats.value.salesByMonth.map(item => item.month),
    datasets: [
      {
        label: 'Ventes',
        data: stats.value.salesByMonth.map(item => item.sales),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  statsStore.fetchAdminStats()
})
</script>
