import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useRouteGuard() {
  const route = useRoute()
  const isInitialized = ref(false)

  // Stocker la route actuelle dans sessionStorage
  const saveCurrentRoute = () => {
    if (route.name && route.name !== 'Login') {
      sessionStorage.setItem('lastRoute', JSON.stringify({
        name: route.name,
        params: route.params,
        query: route.query,
        path: route.path
      }))
    }
  }

  // Restaurer la dernière route après l'authentification
  const restoreLastRoute = () => {
    const lastRoute = sessionStorage.getItem('lastRoute')
    if (lastRoute) {
      try {
        const route = JSON.parse(lastRoute)
        sessionStorage.removeItem('lastRoute')
        return route
      } catch (error) {
        console.error('Erreur lors de la restauration de la route:', error)
      }
    }
    return null
  }

  // Watcher pour sauvegarder automatiquement la route
  watch(() => route.fullPath, saveCurrentRoute, { immediate: true })

  const setInitialized = () => {
    isInitialized.value = true
  }

  return {
    isInitialized,
    saveCurrentRoute,
    restoreLastRoute,
    setInitialized
  }
}
