<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-40">
    <div class="grid grid-cols-4 gap-1 py-2">
      <!-- Home -->
      <router-link
        to="/"
        class="flex flex-col items-center justify-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        active-class="text-primary-600 dark:text-primary-400"
      >
        <HomeIcon class="w-6 h-6" />
        <span class="text-xs mt-1">Accueil</span>
      </router-link>

      <!-- Properties -->
      <router-link
        to="/properties"
        class="flex flex-col items-center justify-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        active-class="text-primary-600 dark:text-primary-400"
      >
        <BuildingOfficeIcon class="w-6 h-6" />
        <span class="text-xs mt-1">Biens</span>
      </router-link>

      <!-- Messages -->
      <router-link
        v-if="authStore.isAuthenticated"
        to="/messages"
        class="relative flex flex-col items-center justify-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        active-class="text-primary-600 dark:text-primary-400"
      >
        <ChatBubbleLeftRightIcon class="w-6 h-6" />
        <span class="text-xs mt-1">Messages</span>
        <span v-if="unreadCount > 0" class="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </router-link>

      <!-- Profile -->
      <router-link
        v-if="authStore.isAuthenticated"
        to="/profile"
        class="flex flex-col items-center justify-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        active-class="text-primary-600 dark:text-primary-400"
      >
        <UserIcon class="w-6 h-6" />
        <span class="text-xs mt-1">Profil</span>
      </router-link>

      <!-- Login -->
      <router-link
        v-else
        to="/login"
        class="flex flex-col items-center justify-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        active-class="text-primary-600 dark:text-primary-400"
      >
        <ArrowRightOnRectangleIcon class="w-6 h-6" />
        <span class="text-xs mt-1">Connexion</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  HomeIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { useMessagingStore } from '../stores/messaging'

const authStore = useAuthStore()
const messagingStore = useMessagingStore()

const unreadCount = computed(() => {
  if (!authStore.currentUser) return 0
  return messagingStore.getUnreadCount(authStore.currentUser.id)
})
</script>
