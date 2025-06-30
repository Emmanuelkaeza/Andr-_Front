<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <HomeIcon class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">
            LeBon Immobilier
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-primary-600 dark:text-primary-400"
          >
            Accueil
          </router-link>
          
          <router-link
            to="/properties"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-primary-600 dark:text-primary-400"
          >
            Propriétés
          </router-link>
          
          <template v-if="authStore.isAuthenticated">
            <!-- Admin Navigation -->
            <template v-if="authStore.currentUser?.role === 'admin'">
              <router-link
                to="/admin"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-primary-600 dark:text-primary-400"
              >
                Admin
              </router-link>
            </template>
            
            <!-- Seller Navigation -->
            <template v-else-if="authStore.currentUser?.role === 'vendeur'">
              <router-link
                to="/dashboard"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-primary-600 dark:text-primary-400"
              >
                Dashboard
              </router-link>
              <router-link
                to="/add-property"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-primary-600 dark:text-primary-400"
              >
                Ajouter
              </router-link>
              <router-link
                to="/my-properties"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-primary-600 dark:text-primary-400"
              >
                Mes Biens
              </router-link>
            </template>
            
            <!-- User Navigation -->
            <template v-else-if="authStore.currentUser?.role === 'client'">
              
              <router-link
                to="/favorites"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-primary-600 dark:text-primary-400"
              >
                Favoris
              </router-link>
            </template>
            
            <!-- Common Navigation for authenticated users -->
            <router-link
              to="/messages"
              class="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 dark:text-primary-400"
            >
              Messages
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ unreadCount }}
              </span>
            </router-link>
          </template>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :title="themeStore.isDark ? 'Mode clair' : 'Mode sombre'"
          >
            <SunIcon v-if="themeStore.isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- User Menu -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <UserIcon class="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ authStore.currentUser?.firstName }}
                </span>
                <ChevronDownIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </MenuButton>
              <MenuItems class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <router-link
                      to="/profile"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                      ]"
                    >
                      Mon Profil
                    </router-link>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="handleLogout"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                      ]"
                    >
                      Déconnexion
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>

          <!-- Auth Buttons -->
          <div v-else class="hidden md:flex items-center space-x-2">
            <router-link
              to="/login"
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Connexion
            </router-link>
            <router-link
              to="/register"
              class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Inscription
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide">
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col space-y-2">
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/"
              @click="mobileMenuOpen = false"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Accueil
            </router-link>
            
            <router-link
              to="/properties"
              @click="mobileMenuOpen = false"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Propriétés
            </router-link>
            
            <template v-if="authStore.isAuthenticated">
              <!-- Admin Mobile Menu -->
              <template v-if="authStore.currentUser?.role === 'admin'">
                <router-link
                  to="/admin"
                  @click="mobileMenuOpen = false"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Tableau de Bord Admin
                </router-link>
              </template>
              
              <!-- Seller Mobile Menu -->
              <template v-else-if="authStore.currentUser?.role === 'vendeur'">
                <router-link
                  to="/dashboard"
                  @click="mobileMenuOpen = false"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Dashboard
                </router-link>
                <router-link
                  to="/add-property"
                  @click="mobileMenuOpen = false"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Ajouter une Propriété
                </router-link>
                <router-link
                  to="/my-properties"
                  @click="mobileMenuOpen = false"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Mes Biens
                </router-link>
              </template>
              
              <!-- User Mobile Menu -->
              <template v-else-if="authStore.currentUser?.role === 'client'">
                <router-link
                  to="/home"
                  @click="mobileMenuOpen = false"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Accueil
                </router-link>
                <router-link
                  to="/favorites"
                  @click="mobileMenuOpen = false"
                  class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Mes Favoris
                </router-link>
              </template>
              
              <!-- Common Mobile Menu -->
              <router-link
                to="/messages"
                @click="mobileMenuOpen = false"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Messages
                <span v-if="unreadCount > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {{ unreadCount }}
                </span>
              </router-link>
              <button
                @click="handleLogout(); mobileMenuOpen = false"
                class="text-left text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Déconnexion
              </button>
            </template>
            
            <template v-else>
              <router-link
                to="/login"
                @click="mobileMenuOpen = false"
                class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors text-center"
              >
                Connexion
              </router-link>
              <router-link
                to="/register"
                @click="mobileMenuOpen = false"
                class="bg-secondary-600 hover:bg-secondary-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors text-center"
              >
                Inscription
              </router-link>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  HomeIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useMessagingStore } from '../stores/messaging'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const messagingStore = useMessagingStore()

const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  try {
    authStore.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // Force la redirection même en cas d'erreur
    window.location.href = '/login'
  }
}

const unreadCount = computed(() => {
  if (!authStore.currentUser) return 0
  return messagingStore.getUnreadCount(authStore.currentUser.id)
})
</script>
