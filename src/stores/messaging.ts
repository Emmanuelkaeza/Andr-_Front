import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiService from '../services/api'
import type { Message, Conversation } from '../types'

export const useMessagingStore = defineStore('messaging', () => {
  const messages = ref<Message[]>([])
  const conversations = ref<Conversation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMessages = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await apiService.getMessages()
      messages.value = data
      
      // Organiser les messages en conversations
      organizeConversations(data)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des messages'
      console.error('Erreur fetchMessages:', err)
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (messageData: {
    content: string
    propertyId: string
    receiverId: string
  }) => {
    try {
      loading.value = true
      error.value = null
      const newMessage = await apiService.sendMessage(messageData)
      
      // Ajouter le message à la liste
      messages.value.push(newMessage)
      
      // Réorganiser les conversations
      organizeConversations(messages.value)
      
      return newMessage
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'envoi du message'
      throw err
    } finally {
      loading.value = false
    }
  }

  const organizeConversations = (messageList: Message[]) => {
    const conversationMap = new Map<string, Conversation>()
    
    messageList.forEach(message => {
      // Créer une clé unique pour la conversation
      const participants = [message.senderId, message.receiverId].sort()
      const key = `${message.propertyId}-${participants[0]}-${participants[1]}`
      
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          id: key, // Utiliser la clé comme ID
          propertyId: message.propertyId,
          participants: [
            message.sender || { 
              id: message.senderId, 
              firstName: '', 
              lastName: '', 
              email: '', 
              role: 'client', 
              isVerified: false, 
              createdAt: '' 
            },
            message.receiver || { 
              id: message.receiverId, 
              firstName: '', 
              lastName: '', 
              email: '', 
              role: 'client', 
              isVerified: false, 
              createdAt: '' 
            }
          ],
          messages: [],
          createdAt: message.timestamp
        })
      }
      
      const conversation = conversationMap.get(key)!
      conversation.messages.push(message)
      conversation.lastMessage = message
    })
    
    conversations.value = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessage?.timestamp || b.createdAt).getTime() - new Date(a.lastMessage?.timestamp || a.createdAt).getTime())
  }

  const markAsRead = (conversationId: string, userId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      conversation.messages
        .filter(m => m.receiverId === userId && !m.read)
        .forEach(m => m.read = true)
    }
  }

  const getConversationsByUser = (userId: string) => {
    return conversations.value.filter(c => 
      c.participants.some(p => p.id === userId)
    )
  }

  const getUnreadCount = (userId: string) => {
    return messages.value.filter(
      m => m.receiverId === userId && !m.read
    ).length
  }

  const clearError = () => {
    error.value = null
  }

  const createConversation = (propertyId: string, otherUserId: string, currentUserId: string) => {
    // Vérifier si une conversation existe déjà
    const existingConversation = conversations.value.find(c => 
      c.propertyId === propertyId && 
      c.participants.some(p => p.id === otherUserId) &&
      c.participants.some(p => p.id === currentUserId)
    )

    if (existingConversation) {
      return existingConversation
    }

    // Créer une nouvelle conversation
    const participants = [currentUserId, otherUserId].sort()
    const conversationId = `${propertyId}-${participants[0]}-${participants[1]}`
    
    const newConversation: Conversation = {
      id: conversationId,
      propertyId,
      participants: [
        { id: currentUserId, firstName: '', lastName: '', email: '', role: 'client', isVerified: false, createdAt: '' },
        { id: otherUserId, firstName: '', lastName: '', email: '', role: 'client', isVerified: false, createdAt: '' }
      ],
      messages: [],
      createdAt: new Date().toISOString()
    }

    conversations.value.unshift(newConversation)
    return newConversation
  }

  return {
    messages,
    conversations,
    loading,
    error,
    fetchMessages,
    sendMessage,
    markAsRead,
    getConversationsByUser,
    getUnreadCount,
    createConversation,
    clearError
  }
})
