<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mes Favoris
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Retrouvez tous les biens que vous avez aimés
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="favoriteProperties.length === 0" class="text-center py-16">
        <HeartIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Aucun favori pour le moment
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Explorez nos propriétés et ajoutez vos coups de cœur à vos favoris
        </p>
        <router-link
          to="/properties"
          class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Explorer les Propriétés
        </router-link>
      </div>

      <!-- Favorites Grid -->
      <div v-else>
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <HeartIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Favoris</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ favoriteProperties.length }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <CurrencyEuroIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ventes</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ favoriteProperties.filter(p => p.type === 'sale').length }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <KeyIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Locations</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ favoriteProperties.filter(p => p.type === 'rent').length }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div class="flex flex-wrap gap-4 items-center">
            <select
              v-model="filters.type"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tous les types</option>
              <option value="sale">Vente</option>
              <option value="rent">Location</option>
            </select>

            <select
              v-model="filters.sortBy"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="surface-desc">Surface décroissante</option>
            </select>

            <button
              @click="clearFilters"
              class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <!-- Properties Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="property in filteredProperties"
            :key="property.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
          >
            <!-- Image -->
            <div class="relative h-48 overflow-hidden">
              <img
                :src="property.images[0]"
                :alt="property.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <!-- Type Badge -->
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

              <!-- Unlike Button -->
              <button
                @click="toggleLike(property.id)"
                class="absolute top-3 right-3 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              >
                <HeartIcon class="w-5 h-5 text-red-500 fill-current" />
              </button>

              <!-- Price Overlay -->
              <div class="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
                <span class="font-bold">
                  {{ formatPrice(property.price) }}€
                  {{ property.type === 'rent' ? '/mois' : '' }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ property.title }}
              </h3>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {{ property.description }}
              </p>

              <!-- Location -->
              <div class="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                <MapPinIcon class="w-4 h-4 mr-1" />
                <span class="text-sm">
                  {{ typeof property.address === 'string' ? property.address : `${property.address.city}, ${property.address.postalCode}` }}
                </span>
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
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img
                    v-if="property.owner?.avatar"
                    :src="property.owner.avatar"
                    :alt="property.owner.name || property.owner.firstName + ' ' + property.owner.lastName"
                    class="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <UserIcon v-else class="w-8 h-8 text-gray-400 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ property.owner?.name || (property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : 'Propriétaire') }}
                  </span>
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    @click="contactOwner(property)"
                    class="bg-secondary-600 hover:bg-secondary-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  >
                    Contacter
                  </button>
                  <router-link
                    :to="{ name: 'PropertyDetail', params: { id: property.id } }"
                    class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  >
                    Voir
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  HeartIcon,
  MapPinIcon,
  HomeIcon,
  UserIcon,
  CurrencyEuroIcon,
  KeyIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { usePropertyStore } from '../stores/property'
import { useMessagingStore } from '../stores/messaging'
import type { Property } from '../types'

const router = useRouter()
const authStore = useAuthStore()
const propertyStore = usePropertyStore()
const messagingStore = useMessagingStore()

const filters = ref({
  type: '',
  sortBy: 'newest'
})

const favoriteProperties = computed(() => {
  if (!authStore.currentUser) return []
  
  return propertyStore.properties.filter(property => 
    property.likes?.includes(authStore.currentUser!.id)
  )
})

const filteredProperties = computed(() => {
  let properties = [...favoriteProperties.value]
  
  // Filter by type
  if (filters.value.type) {
    properties = properties.filter(p => p.type === filters.value.type)
  }
  
  // Sort
  switch (filters.value.sortBy) {
    case 'price-asc':
      properties.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      properties.sort((a, b) => b.price - a.price)
      break
    case 'surface-desc':
      properties.sort((a, b) => b.surface - a.surface)
      break
    case 'newest':
    default:
      properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }
  
  return properties
})

const toggleLike = (propertyId: string) => {
  if (!authStore.currentUser) return
  propertyStore.toggleLike(propertyId, authStore.currentUser.id)
}

const contactOwner = (property: Property) => {
  if (!authStore.currentUser || !property.owner) return
  
  const conversation = messagingStore.createConversation(
    property.id,
    property.owner.id,
    authStore.currentUser.id
  )
  
  router.push({ name: 'Messages', query: { conversation: conversation.id } })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const clearFilters = () => {
  filters.value = {
    type: '',
    sortBy: 'newest'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
