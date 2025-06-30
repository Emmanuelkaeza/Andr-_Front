<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-secondary-400 opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
            <span class="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              LeBon Immobilier
            </span>
          </h1>
          <p class="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto animate-slide-up">
            La plateforme moderne qui connecte propriétaires et locataires pour des transactions immobilières en toute simplicité
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
            <router-link
              to="/properties"
              class="group bg-white text-primary-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span class="flex items-center">
                <MagnifyingGlassIcon class="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                Explorer les Biens
              </span>
            </router-link>
            <router-link
              to="/register"
              class="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span class="flex items-center">
                <UserPlusIcon class="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                Rejoindre Maintenant
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              1,247
            </div>
            <div class="text-gray-600 dark:text-gray-400">Utilisateurs actifs</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
              156
            </div>
            <div class="text-gray-600 dark:text-gray-400">Biens disponibles</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-accent-600 dark:text-accent-400 mb-2">
              89
            </div>
            <div class="text-gray-600 dark:text-gray-400">Ventes réalisées</div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
              98%
            </div>
            <div class="text-gray-600 dark:text-gray-400">Satisfaction client</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pourquoi Nous Choisir ?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Une plateforme complète conçue pour simplifier vos transactions immobilières
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <MagnifyingGlassIcon class="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Recherche Intelligente
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              Trouvez rapidement le bien parfait grâce à notre système de recherche avancée avec filtres intelligents et géolocalisation.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <div class="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900 dark:to-secondary-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <ChatBubbleLeftRightIcon class="w-10 h-10 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Communication Directe
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              Échangez directement avec les propriétaires via notre système de messagerie intégré et sécurisé.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <div class="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900 dark:to-accent-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheckIcon class="w-10 h-10 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Sécurisé et Fiable
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              Tous nos utilisateurs sont vérifiés pour garantir des transactions sécurisées et une expérience de qualité.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comment ça marche ?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            Trois étapes simples pour commencer
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="text-center relative">
            <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
              1
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Créez votre compte
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Inscrivez-vous gratuitement en tant que propriétaire ou client selon vos besoins.
            </p>
            <!-- Arrow -->
            <div class="hidden md:block absolute top-8 -right-4 text-gray-300">
              <ArrowRightIcon class="w-8 h-8" />
            </div>
          </div>

          <!-- Step 2 -->
          <div class="text-center relative">
            <div class="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
              2
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Explorez ou publiez
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Recherchez des biens ou publiez vos propres annonces avec photos et descriptions détaillées.
            </p>
            <!-- Arrow -->
            <div class="hidden md:block absolute top-8 -right-4 text-gray-300">
              <ArrowRightIcon class="w-8 h-8" />
            </div>
          </div>

          <!-- Step 3 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
              3
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Connectez-vous
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Échangez directement avec les propriétaires ou clients intéressés pour finaliser vos transactions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-6">
          Prêt à Commencer Votre Recherche ?
        </h2>
        <p class="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
          Rejoignez des milliers d'utilisateurs qui font confiance à notre plateforme pour leurs projets immobiliers
        </p>
        
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <router-link
            to="/register"
            class="group bg-white text-primary-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span class="flex items-center">
              <UserPlusIcon class="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              Créer un Compte Gratuit
            </span>
          </router-link>
          <router-link
            to="/properties"
            class="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span class="flex items-center">
              <BuildingOfficeIcon class="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              Explorer Sans Compte
            </span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  ArrowRightIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 1s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
