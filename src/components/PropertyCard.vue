<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="property.images?.[0] || '/placeholder-image.jpg'"
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

      <!-- Like Button -->
      <button
        v-if="authStore.isAuthenticated"
        @click.prevent="toggleLike"
        class="absolute top-3 right-3 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
      >
        <HeartIcon
          :class="[
            'w-5 h-5 transition-colors',
            isLiked ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'
          ]"
        />
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
    <div class="p-4">
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
          <span>{{ property.bedrooms || 0 }} ch.</span>
        </div>
      </div>

      <!-- Owner Info -->
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

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
          <span class="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <HeartIcon class="w-4 h-4 mr-1" />
            {{ property.likes?.length || 0 }}
          </span>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  HeartIcon,
  MapPinIcon,
  HomeIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { usePropertyStore } from '../stores/property'
import type { Property } from '../types'

interface Props {
  property: Property
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const propertyStore = usePropertyStore()

const isLiked = computed(() => {
  if (!authStore.currentUser || !props.property.likes) return false
  return props.property.likes.includes(authStore.currentUser.id)
})

const toggleLike = () => {
  if (!authStore.currentUser) return
  propertyStore.toggleLike(props.property.id, authStore.currentUser.id)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
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
