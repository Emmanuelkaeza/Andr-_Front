<template>
  <div v-if="property" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Image Gallery -->
    <div class="relative">
      <div class="h-96 md:h-[500px] overflow-hidden">
        <img
          :src="property.images[currentImageIndex]"
          :alt="property.title"
          class="w-full h-full object-cover"
        />
        
        <!-- Image Navigation -->
        <div v-if="property.images.length > 1" class="absolute inset-0 flex items-center justify-between px-4">
          <button
            @click="previousImage"
            class="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
          >
            <ChevronLeftIcon class="w-6 h-6" />
          </button>
          <button
            @click="nextImage"
            class="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
          >
            <ChevronRightIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Image Indicators -->
        <div v-if="property.images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div class="flex space-x-2">
            <button
              v-for="(image, index) in property.images"
              :key="index"
              @click="currentImageIndex = index"
              :class="[
                'w-3 h-3 rounded-full transition-all',
                currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
              ]"
            />
          </div>
        </div>

        <!-- Back Button -->
        <button
          @click="$router.back()"
          class="absolute top-4 left-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
        >
          <ArrowLeftIcon class="w-6 h-6" />
        </button>

        <!-- Type Badge -->
        <div class="absolute top-4 right-4">
          <span
            :class="[
              'px-4 py-2 rounded-full text-sm font-semibold',
              property.type === 'sale' 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'
            ]"
          >
            {{ property.type === 'sale' ? 'Vente' : 'Location' }}
          </span>
        </div>
      </div>

      <!-- Thumbnail Gallery -->
      <div v-if="property.images.length > 1" class="p-4 bg-white dark:bg-gray-800">
        <div class="flex space-x-2 overflow-x-auto">
          <button
            v-for="(image, index) in property.images"
            :key="index"
            @click="currentImageIndex = index"
            :class="[
              'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
              currentImageIndex === index 
                ? 'border-primary-500' 
                : 'border-gray-200 dark:border-gray-600'
            ]"
          >
            <img
              :src="image"
              :alt="`${property.title} - Image ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Property Details -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Header -->
          <div>
            <div class="flex justify-between items-start mb-4">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ property.title }}
              </h1>
              <button
                v-if="authStore.isAuthenticated"
                @click="toggleLike"
                class="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              >
                <HeartIcon
                  :class="[
                    'w-6 h-6 transition-colors',
                    isLiked ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <MapPinIcon class="w-5 h-5 mr-2" />
              <span>{{ property.address.street }}, {{ property.address.city }} {{ property.address.postalCode }}</span>
            </div>

            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              {{ formatPrice(property.price) }}€
              {{ property.type === 'rent' ? '/mois' : '' }}
            </div>
          </div>

          <!-- Key Features -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
              <HomeIcon class="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ property.surface }}m²</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Surface</div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
              <BuildingOfficeIcon class="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ property.rooms }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Pièces</div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
              <div class="w-8 h-8 bg-primary-600 dark:bg-primary-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span class="text-white font-bold text-sm">{{ property.bedrooms }}</span>
              </div>
              <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ property.bedrooms }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Chambres</div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
              <div class="w-8 h-8 bg-primary-600 dark:bg-primary-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span class="text-white font-bold text-sm">{{ property.bathrooms }}</span>
              </div>
              <div class="text-xl font-semibold text-gray-900 dark:text-white">{{ property.bathrooms }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Salles de bain</div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {{ property.description }}
            </p>
          </div>

          <!-- Features -->
          <div v-if="property.features.length > 0" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Caractéristiques</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="feature in property.features"
                :key="feature"
                class="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Owner Info -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Propriétaire</h3>
            <div class="flex items-center mb-4">
              <img
                v-if="property.owner.avatar"
                :src="property.owner.avatar"
                :alt="property.owner.name"
                class="w-12 h-12 rounded-full object-cover mr-3"
              />
              <UserIcon v-else class="w-12 h-12 text-gray-400 mr-3" />
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ property.owner.name }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Membre depuis {{ formatDate(property.owner.createdAt) }}
                </div>
              </div>
            </div>
            
            <button
              v-if="authStore.isAuthenticated && authStore.currentUser?.id !== property.ownerId"
              @click="startConversation"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <ChatBubbleLeftRightIcon class="w-5 h-5 mr-2" />
              Contacter le propriétaire
            </button>
            
            <div v-else-if="!authStore.isAuthenticated" class="text-center">
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Connectez-vous pour contacter le propriétaire
              </p>
              <router-link
                to="/login"
                class="inline-block bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Se connecter
              </router-link>
            </div>
          </div>

          <!-- Property Stats -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistiques</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Likes</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ property.likes.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Publié le</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(property.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Mis à jour</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(property.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Share -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Partager</h3>
            <div class="flex space-x-3">
              <button
                @click="shareProperty('facebook')"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                Facebook
              </button>
              <button
                @click="shareProperty('twitter')"
                class="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                Twitter
              </button>
              <button
                @click="copyLink"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                Copier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Chargement de la propriété...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CheckIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { usePropertyStore } from '../stores/property'
import { useMessagingStore } from '../stores/messaging'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const propertyStore = usePropertyStore()
const messagingStore = useMessagingStore()

const currentImageIndex = ref(0)

const property = computed(() => {
  return propertyStore.getPropertyById(route.params.id as string)
})

const isLiked = computed(() => {
  if (!authStore.currentUser || !property.value) return false
  return property.value.likes.includes(authStore.currentUser.id)
})

const previousImage = () => {
  if (!property.value) return
  currentImageIndex.value = currentImageIndex.value === 0 
    ? property.value.images.length - 1 
    : currentImageIndex.value - 1
}

const nextImage = () => {
  if (!property.value) return
  currentImageIndex.value = currentImageIndex.value === property.value.images.length - 1 
    ? 0 
    : currentImageIndex.value + 1
}

const toggleLike = () => {
  if (!authStore.currentUser || !property.value) return
  propertyStore.toggleLike(property.value.id, authStore.currentUser.id)
}

const startConversation = () => {
  if (!authStore.currentUser || !property.value || !property.value.owner) return
  
  const conversation = messagingStore.createConversation(
    property.value.id,
    property.value.owner.id,
    authStore.currentUser.id
  )
  
  router.push(`/messages?conversation=${conversation.id}`)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const shareProperty = (platform: string) => {
  const url = window.location.href
  const title = property.value?.title || ''
  
  let shareUrl = ''
  
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      break
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
      break
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
    alert('Lien copié dans le presse-papiers!')
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

onMounted(() => {
  if (!propertyStore.properties.length) {
    propertyStore.fetchProperties()
  }
})
</script>
