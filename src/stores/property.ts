import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiService from '../services/api'
import type { Property, PropertyFilters, CreatePropertyRequest } from '../types'

export const usePropertyStore = defineStore('property', () => {
  const properties = ref<Property[]>([])
  const myProperties = ref<Property[]>([])
  const currentProperty = ref<Property | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProperties = async (filters?: PropertyFilters) => {
    try {
      loading.value = true
      error.value = null
      const data = await apiService.getProperties(filters)
      properties.value = data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des propriétés'
      console.error('Erreur fetchProperties:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchMyProperties = async () => {
    try {
      loading.value = true
      error.value = null
      const data = await apiService.getMyProperties()
      myProperties.value = data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de vos propriétés'
      console.error('Erreur fetchMyProperties:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchPropertyById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      const data = await apiService.getPropertyById(id)
      currentProperty.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la propriété'
      console.error('Erreur fetchPropertyById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProperty = async (propertyData: CreatePropertyRequest) => {
    try {
      loading.value = true
      error.value = null
      const newProperty = await apiService.createProperty(propertyData)
      
      // Ajouter à la liste des propriétés
      properties.value.unshift(newProperty)
      myProperties.value.unshift(newProperty)
      
      return newProperty
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la propriété'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    try {
      loading.value = true
      error.value = null
      const updatedProperty = await apiService.updateProperty(id, propertyData)
      
      // Mettre à jour dans les listes
      const index = properties.value.findIndex(p => p.id === id)
      if (index > -1) {
        properties.value[index] = updatedProperty
      }
      
      const myIndex = myProperties.value.findIndex(p => p.id === id)
      if (myIndex > -1) {
        myProperties.value[myIndex] = updatedProperty
      }
      
      if (currentProperty.value?.id === id) {
        currentProperty.value = updatedProperty
      }
      
      return updatedProperty
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la propriété'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProperty = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await apiService.deleteProperty(id)
      
      // Supprimer des listes
      properties.value = properties.value.filter(p => p.id !== id)
      myProperties.value = myProperties.value.filter(p => p.id !== id)
      
      if (currentProperty.value?.id === id) {
        currentProperty.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la propriété'
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleLike = async (propertyId: string, userId: string) => {
    // Cette fonctionnalité devra être implémentée côté backend
    try {
      // Pour l'instant, on simule localement
      const property = properties.value.find(p => p.id === propertyId)
      if (property) {
        if (!property.likes) property.likes = []
        const likeIndex = property.likes.indexOf(userId)
        if (likeIndex > -1) {
          property.likes.splice(likeIndex, 1)
        } else {
          property.likes.push(userId)
        }
      }
    } catch (err: any) {
      console.error('Erreur toggleLike:', err)
    }
  }

  const getPropertyById = (id: string) => {
    return properties.value.find(p => p.id === id) || 
           myProperties.value.find(p => p.id === id) ||
           currentProperty.value?.id === id ? currentProperty.value : null
  }

  const getPropertiesByOwner = (ownerId: string) => {
    return properties.value.filter(p => p.ownerId === ownerId)
  }

  const addProperty = async (propertyData: CreatePropertyRequest) => {
    // Alias pour createProperty pour compatibilité
    return await createProperty(propertyData)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    properties,
    myProperties,
    currentProperty,
    loading,
    error,
    fetchProperties,
    fetchMyProperties,
    fetchPropertyById,
    getPropertyById,
    getPropertiesByOwner,
    createProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    toggleLike,
    clearError
  }
})
