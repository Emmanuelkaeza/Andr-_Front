<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Navigation Header -->
    <NavHeader />
    
    <!-- Main Content -->
    <main class="pt-16">
      <router-view />
    </main>
    
    <!-- Mobile Navigation Bottom -->
    <MobileNav v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import NavHeader from './components/NavHeader.vue'
import MobileNav from './components/MobileNav.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  // Initialize stores
  authStore.initAuth()
  themeStore.initTheme()
  
  // Check mobile
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background-color: rgb(243 244 246);
}

.dark ::-webkit-scrollbar-track {
  background-color: rgb(31 41 55);
}

::-webkit-scrollbar-thumb {
  background-color: rgb(156 163 175);
  border-radius: 9999px;
}

.dark ::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
