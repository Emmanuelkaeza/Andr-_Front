<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ajouter une Propriété
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Publiez votre bien immobilier et trouvez rapidement des acheteurs ou locataires
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Informations Générales
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre de l'annonce *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Ex: Magnifique villa avec piscine"
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'annonce *
              </label>
              <select v-model="form.type" required class="input-field">
                <option value="">Sélectionner un type</option>
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix *
              </label>
              <div class="relative">
                <input
                  v-model="form.price"
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                  class="input-field pr-12"
                />
                <span class="absolute right-3 top-2 text-gray-500 dark:text-gray-400">€</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ form.type === 'rent' ? 'Prix par mois' : 'Prix de vente' }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                v-model="form.description"
                required
                rows="4"
                placeholder="Décrivez votre bien en détail..."
                class="input-field"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Property Details -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Détails de la Propriété
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Surface (m²) *
              </label>
              <input
                v-model="form.surface"
                type="number"
                required
                min="1"
                placeholder="0"
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de pièces *
              </label>
              <input
                v-model="form.rooms"
                type="number"
                required
                min="1"
                placeholder="0"
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chambres *
              </label>
              <input
                v-model="form.bedrooms"
                type="number"
                required
                min="0"
                placeholder="0"
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salles de bain *
              </label>
              <input
                v-model="form.bathrooms"
                type="number"
                required
                min="1"
                placeholder="1"
                class="input-field"
              />
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Adresse
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rue *
              </label>
              <input
                v-model="form.address.street"
                type="text"
                required
                placeholder="123 Rue de la Paix"
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ville *
              </label>
              <input
                v-model="form.address.city"
                type="text"
                required
                placeholder="Paris"
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code postal *
              </label>
              <input
                v-model="form.address.postalCode"
                type="text"
                required
                placeholder="75001"
                class="input-field"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pays *
              </label>
              <input
                v-model="form.address.country"
                type="text"
                required
                placeholder="France"
                class="input-field"
              />
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Caractéristiques
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <input
                v-model="newFeature"
                type="text"
                placeholder="Ajouter une caractéristique (ex: Piscine, Garage...)"
                class="flex-1 input-field"
                @keydown.enter.prevent="addFeature"
              />
              <button
                type="button"
                @click="addFeature"
                class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Ajouter
              </button>
            </div>

            <div v-if="form.features.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(feature, index) in form.features"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
              >
                {{ feature }}
                <button
                  type="button"
                  @click="removeFeature(index)"
                  class="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Images
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <input
                v-model="newImageUrl"
                type="url"
                placeholder="URL de l'image (ex: https://example.com/image.jpg)"
                class="flex-1 input-field"
                @keydown.enter.prevent="addImage"
              />
              <button
                type="button"
                @click="addImage"
                class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Ajouter
              </button>
            </div>

            <div v-if="form.images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in form.images"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image"
                  :alt="`Image ${index + 1}`"
                  class="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400">
              Ajoutez au moins une image de votre propriété. Les images doivent être accessibles via une URL.
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.back()"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
          >
            {{ loading ? 'Publication...' : 'Publier la Propriété' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { usePropertyStore } from '../stores/property'

const router = useRouter()
const authStore = useAuthStore()
const propertyStore = usePropertyStore()

const loading = ref(false)
const newFeature = ref('')
const newImageUrl = ref('')

const form = ref({
  title: '',
  description: '',
  type: '' as 'sale' | 'rent' | '',
  price: 0,
  surface: 0,
  rooms: 0,
  bedrooms: 0,
  bathrooms: 1,
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: 'France'
  },
  features: [] as string[],
  images: [] as string[]
})

const isFormValid = computed(() => {
  return form.value.title.trim() &&
         form.value.description.trim() &&
         form.value.type &&
         form.value.price > 0 &&
         form.value.surface > 0 &&
         form.value.rooms > 0 &&
         form.value.bedrooms >= 0 &&
         form.value.bathrooms > 0 &&
         form.value.address.street.trim() &&
         form.value.address.city.trim() &&
         form.value.address.postalCode.trim() &&
         form.value.images.length > 0
})

const addFeature = () => {
  if (newFeature.value.trim() && !form.value.features.includes(newFeature.value.trim())) {
    form.value.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

const removeFeature = (index: number) => {
  form.value.features.splice(index, 1)
}

const addImage = () => {
  if (newImageUrl.value.trim() && !form.value.images.includes(newImageUrl.value.trim())) {
    form.value.images.push(newImageUrl.value.trim())
    newImageUrl.value = ''
  }
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

const handleSubmit = async () => {
  if (!isFormValid.value || !authStore.currentUser) return

  loading.value = true

  try {
    const propertyData = {
      ...form.value,
      type: form.value.type as 'sale' | 'rent',
      currency: 'EUR',
      ownerId: authStore.currentUser.id,
      owner: authStore.currentUser
    }

    propertyStore.addProperty(propertyData)
    router.push('/my-properties')
  } catch (error) {
    console.error('Erreur lors de la création de la propriété:', error)
  } finally {
    loading.value = false
  }
}
</script>
