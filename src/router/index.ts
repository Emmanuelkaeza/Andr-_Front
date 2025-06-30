import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/LandingView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/AdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/init-admin',
    name: 'InitAdmin',
    component: () => import('../views/InitAdminView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/properties',
    name: 'Properties',
    component: () => import('../views/PropertiesView.vue')
  },
  {
    path: '/property/:id',
    name: 'PropertyDetail',
    component: () => import('../views/PropertyDetailView.vue'),
    props: true
  },
  {
    path: '/add-property',
    name: 'AddProperty',
    component: () => import('../views/AddPropertyView.vue'),
    meta: { requiresAuth: true, requiresOwner: true }
  },
  {
    path: '/my-properties',
    name: 'MyProperties',
    component: () => import('../views/MyPropertiesView.vue'),
    meta: { requiresAuth: true, requiresOwner: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../views/MessagesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoritesView.vue'),
    meta: { requiresAuth: true, requiresClient: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  // Attendre que l'authentification soit initialisée
  if (!authStore.initialized) {
    await new Promise<void>(resolve => {
      const unwatch = authStore.$subscribe((_mutation, state) => {
        if (state.initialized) {
          unwatch()
          resolve()
        }
      })
    })
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const requiresOwner = to.matched.some(record => record.meta.requiresOwner)
  const requiresClient = to.matched.some(record => record.meta.requiresClient)

  // Vérifier l'authentification
  if (requiresAuth && !authStore.isAuthenticated) {
    // Sauvegarder la route de destination pour redirection après login
    if (to.path !== '/login') {
      sessionStorage.setItem('redirectAfterLogin', to.fullPath)
    }
    next('/login')
    return
  }
  
  if (requiresGuest && authStore.isAuthenticated) {
    // Utilisateur déjà connecté essayant d'accéder aux pages guest
    const userRole = authStore.currentUser?.role
    if (userRole === 'admin') {
      next('/admin')
    } else if (userRole === 'vendeur') {
      next('/dashboard')
    } else {
      next('/properties')
    }
    return
  }
  
  // Vérifications de rôles
  if (requiresAdmin && authStore.currentUser?.role !== 'admin') {
    next('/properties') // Rediriger vers une page accessible
    return
  }
  
  if (requiresOwner && authStore.currentUser?.role !== 'vendeur') {
    next('/properties')
    return
  }
  
  if (requiresClient && authStore.currentUser?.role !== 'client') {
    next('/properties')
    return
  }
  
  next()
})

export default router
