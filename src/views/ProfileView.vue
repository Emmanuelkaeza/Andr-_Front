<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mon Profil
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <!-- Avatar -->
            <div class="mb-4">
              <img
                v-if="authStore.currentUser?.avatar"
                :src="authStore.currentUser.avatar"
                :alt="authStore.currentUser.name"
                class="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <div v-else class="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto">
                <UserIcon class="w-12 h-12 text-gray-500 dark:text-gray-400" />
              </div>
              
              <button
                @click="changeAvatar"
                class="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Changer la photo
              </button>
            </div>

            <!-- User Info -->
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {{ authStore.currentUser?.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              {{ authStore.currentUser?.email }}
            </p>
            <span
              :class="[
                'inline-flex px-3 py-1 rounded-full text-xs font-semibold',
                authStore.currentUser?.role === 'vendeur'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              ]"
            >
              {{ authStore.currentUser?.role === 'vendeur' ? 'Propriétaire' : authStore.currentUser?.role === 'admin' ? 'Administrateur' : 'Client' }}
            </span>

            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Membre depuis {{ formatDate(authStore.currentUser?.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div v-if="authStore.currentUser?.role === 'vendeur'" class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mes Statistiques
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Propriétés publiées</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ myPropertiesCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total des likes</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ totalLikes }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Messages reçus</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ messagesReceived }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Informations Personnelles
            </h3>
            
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    required
                    class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    required
                    class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    v-model="profileForm.phone"
                    type="tel"
                    class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type de compte
                  </label>
                  <select
                    v-model="profileForm.type"
                    class="input-field"
                  >
                    <option value="owner">Propriétaire</option>
                    <option value="client">Client</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="profileLoading"
                  class="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  {{ profileLoading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Password Change -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Changer le Mot de Passe
            </h3>
            
            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="input-field"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="input-field"
                />
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="passwordLoading"
                  class="bg-secondary-600 hover:bg-secondary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  {{ passwordLoading ? 'Modification...' : 'Changer le mot de passe' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Preferences -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Préférences
            </h3>
            
            <div class="space-y-4">
              <!-- Theme Toggle -->
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    Thème sombre
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Utiliser le mode sombre pour l'interface
                  </p>
                </div>
                <button
                  @click="themeStore.toggleTheme"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    themeStore.isDark ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      themeStore.isDark ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
              </div>

              <!-- Email Notifications -->
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications par email
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Recevoir des notifications pour les nouveaux messages
                  </p>
                </div>
                <button
                  @click="toggleEmailNotifications"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    emailNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-red-200 dark:border-red-800">
            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-6">
              Zone de Danger
            </h3>
            
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Supprimer mon compte
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                </p>
                <button
                  @click="confirmDeleteAccount"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Supprimer mon compte
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Êtes-vous absolument sûr de vouloir supprimer votre compte ? 
          Cette action est irréversible et toutes vos données seront perdues.
        </p>
        <div class="flex space-x-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            @click="deleteAccount"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { usePropertyStore } from '../stores/property'
import { useMessagingStore } from '../stores/messaging'
import type { Property } from '../types'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const propertyStore = usePropertyStore()
const messagingStore = useMessagingStore()

const profileLoading = ref(false)
const passwordLoading = ref(false)
const emailNotifications = ref(true)
const showDeleteModal = ref(false)

const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  type: 'client' as 'owner' | 'client'
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const myPropertiesCount = computed(() => {
  if (!authStore.currentUser) return 0
  return propertyStore.getPropertiesByOwner(authStore.currentUser.id).length
})

const totalLikes = computed(() => {
  if (!authStore.currentUser) return 0
  return propertyStore.getPropertiesByOwner(authStore.currentUser.id)
    .reduce((total: number, property: Property) => total + (property.likes?.length || 0), 0)
})

const messagesReceived = computed(() => {
  if (!authStore.currentUser) return 0
  return messagingStore.getConversationsByUser(authStore.currentUser.id).length
})

const formatDate = (date?: string | Date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const changeAvatar = () => {
  const url = prompt('Entrez l\'URL de votre nouvelle photo de profil:')
  if (url && authStore.currentUser) {
    authStore.currentUser.avatar = url
    // In a real app, you'd save this to the backend
  }
}

const updateProfile = async () => {
  profileLoading.value = true
  
  try {
    // In a real app, you'd make an API call here
    if (authStore.currentUser) {
      authStore.currentUser.name = profileForm.value.name
      authStore.currentUser.email = profileForm.value.email
      authStore.currentUser.phoneNumber = profileForm.value.phone
      // Note: type devient role dans notre backend
      // authStore.currentUser.role = profileForm.value.type
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(authStore.currentUser))
    }
    
    alert('Profil mis à jour avec succès!')
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    alert('Erreur lors de la mise à jour du profil')
  } finally {
    profileLoading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Les nouveaux mots de passe ne correspondent pas')
    return
  }
  
  passwordLoading.value = true
  
  try {
    // In a real app, you'd make an API call here
    alert('Mot de passe changé avec succès!')
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
    alert('Erreur lors du changement de mot de passe')
  } finally {
    passwordLoading.value = false
  }
}

const toggleEmailNotifications = () => {
  emailNotifications.value = !emailNotifications.value
  // In a real app, you'd save this preference to the backend
}

const confirmDeleteAccount = () => {
  showDeleteModal.value = true
}

const deleteAccount = () => {
  // In a real app, you'd make an API call to delete the account
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  // Initialize form with current user data
  if (authStore.currentUser) {
    profileForm.value = {
      name: authStore.currentUser.name || '',
      email: authStore.currentUser.email,
      phone: authStore.currentUser.phoneNumber || '',
      type: authStore.currentUser.role === 'vendeur' ? 'owner' : 'client'
    }
  }
})
</script>
