<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Messages
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gérez vos conversations avec les propriétaires et clients
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" style="height: calc(100vh - 200px);">
        <div class="flex h-full">
          <!-- Conversations List -->
          <div class="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <!-- Search -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="relative">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher une conversation..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <!-- Conversations -->
            <div class="flex-1 overflow-y-auto">
              <div v-if="filteredConversations.length === 0" class="p-4 text-center">
                <ChatBubbleLeftRightIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-500 dark:text-gray-400">Aucune conversation</p>
              </div>

              <div
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                @click="selectConversation(conversation)"
                :class="[
                  'p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                  selectedConversation?.id === conversation.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                ]"
              >
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <img
                      v-if="getOtherParticipant(conversation)?.avatar"
                      :src="getOtherParticipant(conversation)?.avatar"
                      :alt="getOtherParticipant(conversation)?.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <UserIcon v-else class="w-12 h-12 text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full p-2" />
                    
                    <!-- Unread Indicator -->
                    <div
                      v-if="getUnreadCount(conversation) > 0"
                      class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {{ getUnreadCount(conversation) }}
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-1">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ getOtherParticipant(conversation)?.name }}
                      </h3>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatMessageTime(conversation.lastMessage?.timestamp) }}
                      </span>
                    </div>
                    
                    <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {{ conversation.lastMessage?.content || 'Commencer la conversation...' }}
                    </p>
                    
                    <!-- Property Info -->
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ getPropertyTitle(conversation.propertyId) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Area -->
          <div class="flex-1 flex flex-col">
            <!-- Chat Header -->
            <div v-if="selectedConversation" class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div class="flex items-center space-x-3">
                <img
                  v-if="getOtherParticipant(selectedConversation)?.avatar"
                  :src="getOtherParticipant(selectedConversation)?.avatar"
                  :alt="getOtherParticipant(selectedConversation)?.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <UserIcon v-else class="w-10 h-10 text-gray-400 bg-gray-200 dark:bg-gray-600 rounded-full p-2" />
                
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">
                    {{ getOtherParticipant(selectedConversation)?.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ getPropertyTitle(selectedConversation.propertyId) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Messages -->
            <div v-if="selectedConversation" ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
              <div
                v-for="message in selectedConversation.messages"
                :key="message.id"
                :class="[
                  'flex',
                  message.senderId === authStore.currentUser?.id ? 'justify-end' : 'justify-start'
                ]"
              >
                <div
                  :class="[
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    message.senderId === authStore.currentUser?.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  ]"
                >
                  <p class="text-sm">{{ message.content }}</p>
                  <p
                    :class="[
                      'text-xs mt-1',
                      message.senderId === authStore.currentUser?.id
                        ? 'text-primary-100'
                        : 'text-gray-500 dark:text-gray-400'
                    ]"
                  >
                    {{ formatMessageTime(message.timestamp) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <ChatBubbleLeftRightIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Sélectionnez une conversation
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Choisissez une conversation pour commencer à discuter
                </p>
              </div>
            </div>

            <!-- Message Input -->
            <div v-if="selectedConversation" class="p-4 border-t border-gray-200 dark:border-gray-700">
              <form @submit.prevent="sendMessage" class="flex space-x-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Tapez votre message..."
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  :disabled="!newMessage.trim()"
                  class="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <PaperAirplaneIcon class="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'
import { useMessagingStore } from '../stores/messaging'
import { usePropertyStore } from '../stores/property'
import type { Conversation, User } from '../types'

const route = useRoute()
const authStore = useAuthStore()
const messagingStore = useMessagingStore()
const propertyStore = usePropertyStore()

const searchQuery = ref('')
const selectedConversation = ref<Conversation | null>(null)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const filteredConversations = computed(() => {
  if (!authStore.currentUser) return []
  
  let conversations = messagingStore.getConversationsByUser(authStore.currentUser.id)
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    conversations = conversations.filter(conv => {
      const otherParticipant = getOtherParticipant(conv)
      const propertyTitle = getPropertyTitle(conv.propertyId)
      return (
        otherParticipant?.name.toLowerCase().includes(query) ||
        propertyTitle.toLowerCase().includes(query)
      )
    })
  }
  
  return conversations.sort((a, b) => {
    const aTime = a.lastMessage?.timestamp || a.createdAt
    const bTime = b.lastMessage?.timestamp || b.createdAt
    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })
})

const getOtherParticipant = (conversation: Conversation): User | undefined => {
  if (!authStore.currentUser) return undefined
  return conversation.participants.find(p => p.id !== authStore.currentUser!.id)
}

const getUnreadCount = (conversation: Conversation): number => {
  if (!authStore.currentUser) return 0
  return conversation.messages.filter(
    m => m.receiverId === authStore.currentUser!.id && !m.read
  ).length
}

const getPropertyTitle = (propertyId: string): string => {
  const property = propertyStore.getPropertyById(propertyId)
  return property?.title || 'Propriété introuvable'
}

const formatMessageTime = (timestamp?: string | Date): string => {
  if (!timestamp) return ''
  
  const now = new Date()
  const messageDate = new Date(timestamp)
  const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (diffInHours < 24 * 7) {
    return messageDate.toLocaleDateString('fr-FR', { 
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return messageDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }
}

const selectConversation = (conversation: Conversation) => {
  selectedConversation.value = conversation
  
  // Mark messages as read
  if (authStore.currentUser) {
    messagingStore.markAsRead(conversation.id, authStore.currentUser.id)
  }
  
  // Scroll to bottom
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value || !authStore.currentUser) return
  
  // Trouver l'autre participant pour obtenir le receiverId
  const otherParticipant = getOtherParticipant(selectedConversation.value)
  if (!otherParticipant) return
  
  messagingStore.sendMessage({
    content: newMessage.value.trim(),
    propertyId: selectedConversation.value.propertyId,
    receiverId: otherParticipant.id
  })
  
  newMessage.value = ''
  
  // Scroll to bottom
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for new messages to scroll to bottom
watch(
  () => selectedConversation.value?.messages.length,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  }
)

onMounted(() => {
  // Load properties if not already loaded
  if (!propertyStore.properties.length) {
    propertyStore.fetchProperties()
  }
  
  // Check if we should open a specific conversation from URL
  const conversationId = route.query.conversation as string
  if (conversationId) {
    const conversation = messagingStore.conversations.find(c => c.id === conversationId)
    if (conversation) {
      selectConversation(conversation)
    }
  }
})
</script>
