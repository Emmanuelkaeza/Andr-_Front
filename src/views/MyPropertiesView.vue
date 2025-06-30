<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mes Propriétés
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Gérez vos annonces immobilières
          </p>
        </div>
        <router-link
          to="/add-property"
          class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Ajouter une Propriété
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <HomeIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ myProperties.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CurrencyEuroIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Ventes</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ salesCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <KeyIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Locations</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ rentalsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <HeartIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalLikes }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <select
              v-model="filterType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tous les types</option>
              <option value="sale">Vente</option>
              <option value="rent">Location</option>
            </select>
          </div>
          <div class="flex-1">
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="date-desc">Plus récent</option>
              <option value="date-asc">Plus ancien</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="price-asc">Prix croissant</option>
              <option value="likes-desc">Plus de likes</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Properties List -->
      <div v-if="filteredProperties.length === 0" class="text-center py-12">
        <HomeIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ myProperties.length === 0 ? 'Aucune propriété' : 'Aucun résultat' }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ myProperties.length === 0 
            ? 'Vous n\'avez pas encore publié de propriété.' 
            : 'Aucune propriété ne correspond à vos filtres.' 
          }}
        </p>
        <router-link
          v-if="myProperties.length === 0"
          to="/add-property"
          class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Ajouter ma première propriété
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="property in filteredProperties"
          :key="property.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          <!-- Image -->
          <div class="relative h-48 overflow-hidden">
            <img
              :src="property.images[0]"
              :alt="property.title"
              class="w-full h-full object-cover"
            />
            
            <!-- Status Badge -->
            <div class="absolute top-3 left-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  property.type === 'sale' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                ]"
              >
                {{ property.type === 'sale' ? 'Vente' : 'Location' }}
              </span>
            </div>

            <!-- Likes -->
            <div class="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg flex items-center">
              <HeartIcon class="w-4 h-4 mr-1" />
              <span class="text-sm">{{ property.likes.length }}</span>
            </div>

            <!-- Price -->
            <div class="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
              <span class="font-bold">
                {{ formatPrice(property.price) }}€
                {{ property.type === 'rent' ? '/mois' : '' }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {{ property.title }}
            </h3>
            
            <div class="flex items-center text-gray-500 dark:text-gray-400 mb-3">
              <MapPinIcon class="w-4 h-4 mr-1" />
              <span class="text-sm">{{ property.address.city }}, {{ property.address.postalCode }}</span>
            </div>

            <!-- Property Details -->
            <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div class="flex items-center">
                <HomeIcon class="w-4 h-4 mr-1" />
                <span>{{ property.surface }}m²</span>
              </div>
              <div class="flex items-center">
                <span>{{ property.rooms }} pièces</span>
              </div>
              <div class="flex items-center">
                <span>{{ property.bedrooms }} ch.</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <router-link
                :to="{ name: 'PropertyDetail', params: { id: property.id } }"
                class="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                Voir
              </router-link>
              <button
                @click="editProperty(property.id)"
                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                Modifier
              </button>
              <button
                @click="confirmDelete(property)"
                class="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="propertyToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="propertyToDelete = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Supprimer la propriété
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Êtes-vous sûr de vouloir supprimer "{{ propertyToDelete.title }}" ? 
          Cette action est irréversible.
        </p>
        <div class="flex space-x-3">
          <button
            @click="propertyToDelete = null"
            class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            @click="deleteProperty"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  HomeIcon,
  CurrencyEuroIcon,
  KeyIcon,
  HeartIcon,
  MapPinIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { usePropertyStore } from '../stores/property'
import type { Property } from '../types'

const authStore = useAuthStore()
const propertyStore = usePropertyStore()

const filterType = ref('')
const sortBy = ref('date-desc')
const propertyToDelete = ref<Property | null>(null)

const myProperties = computed(() => {
  if (!authStore.currentUser) return []
  return propertyStore.getPropertiesByOwner(authStore.currentUser.id)
})

const salesCount = computed(() => {
  return myProperties.value.filter((p: Property) => p.type === 'sale').length
})

const rentalsCount = computed(() => {
  return myProperties.value.filter((p: Property) => p.type === 'rent').length
})

const totalLikes = computed(() => {
  return myProperties.value.reduce((total: number, property: Property) => total + (property.likes?.length || 0), 0)
})

const filteredProperties = computed(() => {
  let properties = [...myProperties.value]

  // Apply type filter
  if (filterType.value) {
    properties = properties.filter(p => p.type === filterType.value)
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'date-desc':
      return properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'date-asc':
      return properties.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'price-desc':
      return properties.sort((a, b) => b.price - a.price)
    case 'price-asc':
      return properties.sort((a, b) => a.price - b.price)
    case 'likes-desc':
      return properties.sort((a, b) => b.likes.length - a.likes.length)
    default:
      return properties
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const editProperty = (id: string) => {
  // For now, just navigate to the property detail
  // In a real app, you'd have an edit form
  console.log('Edit property:', id)
  alert('Fonctionnalité de modification à venir...')
}

const confirmDelete = (property: Property) => {
  propertyToDelete.value = property
}

const deleteProperty = () => {
  if (!propertyToDelete.value) return
  
  // In a real app, you'd call an API to delete the property
  console.log('Delete property:', propertyToDelete.value.id)
  
  // For now, just remove from local state
  const index = propertyStore.properties.findIndex(p => p.id === propertyToDelete.value!.id)
  if (index > -1) {
    propertyStore.properties.splice(index, 1)
  }
  
  propertyToDelete.value = null
}

onMounted(() => {
  if (!propertyStore.properties.length) {
    propertyStore.fetchProperties()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
