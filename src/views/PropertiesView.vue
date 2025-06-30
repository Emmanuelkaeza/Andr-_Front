<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Rechercher des Propriétés
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Découvrez les meilleurs biens immobiliers disponibles
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              v-model="filters.type"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tous</option>
              <option value="sale">Vente</option>
              <option value="rent">Location</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ville
            </label>
            <input
              v-model="filters.city"
              @input="applyFilters"
              type="text"
              placeholder="Entrez une ville"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prix max
            </label>
            <input
              v-model="filters.maxPrice"
              @input="applyFilters"
              type="number"
              placeholder="Prix maximum"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pièces min
            </label>
            <select
              v-model="filters.minRooms"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Toutes</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Results Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-4">
          <p class="text-gray-600 dark:text-gray-400">
            {{ filteredProperties.length }} bien{{ filteredProperties.length > 1 ? 's' : '' }} trouvé{{ filteredProperties.length > 1 ? 's' : '' }}
          </p>
          
          <!-- View Toggle -->
          <div class="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <Squares2X2Icon class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <ListBulletIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Sort -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">Trier par :</label>
          <select
            v-model="sortBy"
            @change="applySorting"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="date-desc">Plus récent</option>
            <option value="date-asc">Plus ancien</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="surface-desc">Surface décroissante</option>
          </select>
        </div>
      </div>

      <!-- Properties Grid/List -->
      <div v-if="propertyStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="i" class="animate-pulse">
          <div class="bg-gray-300 dark:bg-gray-700 rounded-xl h-64 mb-4"></div>
          <div class="space-y-2">
            <div class="bg-gray-300 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            <div class="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredProperties.length === 0" class="text-center py-12">
        <HomeIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun bien trouvé
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Essayez de modifier vos critères de recherche
        </p>
      </div>

      <div
        v-else
        :class="[
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-6'
        ]"
      >
        <PropertyCard
          v-for="property in paginatedProperties"
          :key="property.id"
          :property="property"
          :class="viewMode === 'list' ? 'w-full' : ''"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <nav class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="currentPage = typeof page === 'number' ? page : currentPage"
              :class="[
                'px-3 py-2 rounded-md border text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-gray-500">...</span>
          </template>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/vue/24/outline'
import { usePropertyStore } from '../stores/property'
import PropertyCard from '../components/PropertyCard.vue'

const route = useRoute()
const propertyStore = usePropertyStore()

const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = 9
const sortBy = ref('date-desc')

const filters = ref({
  type: '',
  city: '',
  maxPrice: '',
  minRooms: ''
})

// Apply URL query parameters
onMounted(() => {
  propertyStore.fetchProperties()
  
  // Apply filters from URL
  if (route.query.type) filters.value.type = route.query.type as string
  if (route.query.city) filters.value.city = route.query.city as string
  if (route.query.maxPrice) filters.value.maxPrice = route.query.maxPrice as string
})

const filteredProperties = computed(() => {
  let properties = [...propertyStore.properties]

  // Apply filters
  if (filters.value.type) {
    properties = properties.filter(p => p.type === filters.value.type)
  }

  if (filters.value.city) {
    properties = properties.filter(p => {
      const address = typeof p.address === 'string' ? p.address : p.address.city
      return address.toLowerCase().includes(filters.value.city.toLowerCase())
    })
  }

  if (filters.value.maxPrice) {
    const maxPrice = parseInt(filters.value.maxPrice)
    properties = properties.filter(p => p.price <= maxPrice)
  }

  if (filters.value.minRooms) {
    const minRooms = parseInt(filters.value.minRooms)
    properties = properties.filter(p => p.rooms >= minRooms)
  }

  return properties
})

const sortedProperties = computed(() => {
  const properties = [...filteredProperties.value]
  
  switch (sortBy.value) {
    case 'date-desc':
      return properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'date-asc':
      return properties.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'price-asc':
      return properties.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return properties.sort((a, b) => b.price - a.price)
    case 'surface-desc':
      return properties.sort((a, b) => b.surface - a.surface)
    default:
      return properties
  }
})

const paginatedProperties = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedProperties.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProperties.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    pages.push(total)
  }
  
  return pages
})

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  filters.value = {
    type: '',
    city: '',
    maxPrice: '',
    minRooms: ''
  }
  currentPage.value = 1
}

const applySorting = () => {
  currentPage.value = 1
}

// Watch for filter changes to reset pagination
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })
</script>
