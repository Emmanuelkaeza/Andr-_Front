<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de Bord Administrateur
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Vue d'ensemble de la plateforme LeBon Immobilier
        </p>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs Total</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ dashboardStore.stats?.users.totalUsers || 0 }}
              </p>
              <p class="text-sm text-green-600 dark:text-green-400">
                +{{ dashboardStore.stats?.users.newUsersThisMonth || 0 }} ce mois
              </p>
            </div>
            <div class="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
              <UsersIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-secondary-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Propriétés Total</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ dashboardStore.stats?.properties.totalProperties || 0 }}
              </p>
              <p class="text-sm text-blue-600 dark:text-blue-400">
                {{ dashboardStore.stats?.properties.totalSales || 0 }} ventes / {{ dashboardStore.stats?.properties.totalRentals || 0 }} locations
              </p>
            </div>
            <div class="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900">
              <BuildingOfficeIcon class="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-accent-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Revenus Total</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(dashboardStore.stats?.revenue.totalRevenue || 0) }}
              </p>
              <p class="text-sm text-yellow-600 dark:text-yellow-400">
                {{ formatCurrency(dashboardStore.stats?.revenue.monthlyRevenue || 0) }}/mois
              </p>
            </div>
            <div class="p-3 rounded-full bg-accent-100 dark:bg-accent-900">
              <CurrencyEuroIcon class="w-8 h-8 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs Actifs</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ dashboardStore.stats?.users.activeUsers || 0 }}
              </p>
              <p class="text-sm text-green-600 dark:text-green-400">
                Dernières 24h
              </p>
            </div>
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <ChartBarIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Évolution des Revenus
            </h3>
            <select class="text-sm border rounded-md px-2 py-1 dark:bg-gray-700 dark:border-gray-600">
              <option>6 derniers mois</option>
              <option>12 derniers mois</option>
            </select>
          </div>
          <div class="h-80">
            <Line
              v-if="!dashboardStore.loading && revenueChartData"
              :data="revenueChartData"
              :options="revenueChartOptions"
            />
            <div v-else class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>

        <!-- User Distribution -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition des Utilisateurs
          </h3>
          <div class="h-80">
            <Doughnut
              v-if="!dashboardStore.loading && userDistributionData"
              :data="userDistributionData"
              :options="doughnutChartOptions"
            />
            <div v-else class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Property Performance -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance des Propriétés
        </h3>
        <div class="h-64">
          <Bar
            v-if="!dashboardStore.loading && propertyPerformanceData"
            :data="propertyPerformanceData"
            :options="barChartOptions"
          />
          <div v-else class="flex items-center justify-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>

      <!-- Quick Admin Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Gestion des Utilisateurs
          </h4>
          <div class="space-y-3">
            <button class="w-full text-left p-3 bg-primary-50 dark:bg-primary-900 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
              <div class="flex items-center">
                <UserPlusIcon class="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
                <span class="text-primary-700 dark:text-primary-300">Ajouter un utilisateur</span>
              </div>
            </button>
            <button class="w-full text-left p-3 bg-red-50 dark:bg-red-900 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors">
              <div class="flex items-center">
                <ExclamationTriangleIcon class="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                <span class="text-red-700 dark:text-red-300">Utilisateurs signalés</span>
              </div>
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Modération
          </h4>
          <div class="space-y-3">
            <button class="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors">
              <div class="flex items-center">
                <FlagIcon class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                <span class="text-yellow-700 dark:text-yellow-300">Propriétés en attente</span>
              </div>
            </button>
            <button class="w-full text-left p-3 bg-orange-50 dark:bg-orange-900 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors">
              <div class="flex items-center">
                <ChatBubbleLeftRightIcon class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
                <span class="text-orange-700 dark:text-orange-300">Messages signalés</span>
              </div>
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Système
          </h4>
          <div class="space-y-3">
            <button class="w-full text-left p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
              <div class="flex items-center">
                <CogIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span class="text-blue-700 dark:text-blue-300">Configuration</span>
              </div>
            </button>
            <button class="w-full text-left p-3 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors">
              <div class="flex items-center">
                <DocumentChartBarIcon class="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                <span class="text-green-700 dark:text-green-300">Rapports</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Activité Récente
        </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" alt="">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">Jean Dupont</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">jean@example.com</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Nouvelle propriété ajoutée
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Il y a 2 heures
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Approuvé
                  </span>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1494790108755-2616b612b787?w=150" alt="">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">Marie Martin</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">marie@example.com</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Inscription utilisateur
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Il y a 4 heures
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Actif
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { Line, Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import {
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { useDashboardStore } from '../stores/dashboard'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount)
}

const revenueChartData = computed(() => {
  if (!dashboardStore.stats) return null
  
  const monthlyData = dashboardStore.getMonthlyData()
  return {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Revenus (€)',
        data: monthlyData.map(item => item.sales * 2500 + item.rentals * 150),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const userDistributionData = computed(() => {
  const userData = dashboardStore.getUserTypeData()
  if (!userData.length) return null
  
  return {
    labels: userData.map(item => item.label),
    datasets: [{
      data: userData.map(item => item.value),
      backgroundColor: userData.map(item => item.color),
      borderWidth: 0
    }]
  }
})

const propertyPerformanceData = computed(() => {
  if (!dashboardStore.stats) return null
  
  const monthlyData = dashboardStore.getMonthlyData()
  return {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Ventes',
        data: monthlyData.map(item => item.sales),
        backgroundColor: '#10b981',
        borderRadius: 4
      },
      {
        label: 'Locations',
        data: monthlyData.map(item => item.rentals),
        backgroundColor: '#3b82f6',
        borderRadius: 4
      }
    ]
  }
})

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

onMounted(() => {
  dashboardStore.fetchStats('admin')
})
</script>
