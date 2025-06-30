<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Trouvez Votre Bien Immobilier Idéal
          </h1>
          <p class="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Achat, vente, location - Votre partenaire immobilier de confiance
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <router-link
              to="/properties"
              class="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Explorer les Biens
            </router-link>
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/register"
              class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all"
            >
              Commencer Maintenant
            </router-link>
            <router-link
              v-else
              to="/add-property"
              class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all"
            >
              Publier un Bien
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 shadow-lg">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Recherchez Votre Bien
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                v-model="searchFilters.type"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
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
                v-model="searchFilters.city"
                type="text"
                placeholder="Entrez une ville"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix max
              </label>
              <input
                v-model="searchFilters.maxPrice"
                type="number"
                placeholder="Prix maximum"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="performSearch"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
              >
                <MagnifyingGlassIcon class="w-5 h-5 inline mr-2" />
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pourquoi Nous Choisir ?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            Une plateforme moderne pour tous vos besoins immobiliers
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Recherche Avancée
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Trouvez rapidement le bien qui correspond à vos critères avec notre système de recherche intelligent.
            </p>
          </div>

          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon class="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Communication Directe
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Contactez directement les propriétaires via notre système de messagerie intégré.
            </p>
          </div>

          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon class="w-8 h-8 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sécurisé et Fiable
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Tous nos utilisateurs sont vérifiés pour garantir des transactions en toute sécurité.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Properties Section -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Biens Récents
          </h2>
          <router-link
            to="/properties"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
          >
            Voir tout →
          </router-link>
        </div>

        <div v-if="propertyStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-300 dark:bg-gray-700 rounded-xl h-48 mb-4"></div>
            <div class="space-y-2">
              <div class="bg-gray-300 dark:bg-gray-700 h-4 rounded w-3/4"></div>
              <div class="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard
            v-for="property in recentProperties"
            :key="property.id"
            :property="property"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">
          Prêt à Commencer ?
        </h2>
        <p class="text-xl mb-8 opacity-90">
          Rejoignez des milliers d'utilisateurs qui font confiance à notre plateforme
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Créer un Compte
          </router-link>
          <router-link
            v-else
            to="/add-property"
            class="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Publier un Bien
          </router-link>
          <router-link
            to="/properties"
            class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all"
          >
            Explorer les Biens
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '../stores/auth'
import { usePropertyStore } from '../stores/property'
import PropertyCard from '../components/PropertyCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const propertyStore = usePropertyStore()

const searchFilters = ref({
  type: '',
  city: '',
  maxPrice: ''
})

const recentProperties = computed(() => {
  return propertyStore.properties.slice(0, 6)
})

const performSearch = () => {
  router.push({
    name: 'Properties',
    query: {
      type: searchFilters.value.type || undefined,
      city: searchFilters.value.city || undefined,
      maxPrice: searchFilters.value.maxPrice || undefined
    }
  })
}

onMounted(() => {
  propertyStore.fetchProperties()
})
</script>
