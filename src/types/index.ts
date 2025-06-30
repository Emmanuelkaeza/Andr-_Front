// Types basés sur la structure du backend selon le README
export interface User {
  id: string // UUID selon le README
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: 'client' | 'vendeur' | 'admin'
  isVerified: boolean
  createdAt: string
  // Propriétés calculées pour compatibilité
  name?: string // Combinaison firstName + lastName
  avatar?: string // Propriété optionnelle pour avatar
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country?: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: string // appartement, maison, etc.
  city: string
  address: string | Address // Support pour les deux formats
  surface: number
  rooms: number
  bedrooms?: number // Ajout de la propriété bedrooms
  status: 'AVAILABLE' | 'SOLD' | 'RENTED'
  images?: string[]
  features?: string[]
  ownerId: string
  owner?: User // Optionnel pour éviter les erreurs
  likes?: string[] // user IDs who liked
  createdAt: string
  updatedAt?: string
}

export interface Message {
  id: string
  content: string
  propertyId: string
  senderId: string
  receiverId: string
  timestamp: string
  read: boolean
  sender?: User
  receiver?: User
  property?: Property
}

export interface Conversation {
  id: string
  propertyId: string
  participants: User[]
  lastMessage?: Message
  messages: Message[]
  createdAt: string
}

export interface Theme {
  mode: 'light' | 'dark'
}

export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  role: string
}

export interface PropertyFilters {
  type?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  status?: string
}

export interface CreatePropertyRequest {
  title: string
  description: string
  price: number
  type: string
  city: string
  address: string
  surface: number
  rooms: number
}

export interface AdminStats {
  totalUsers: number
  totalProperties: number
  totalMessages: number
  recentActivity: any[]
  propertyByType: { [key: string]: number }
  salesByMonth: { month: string; sales: number }[]
}

export interface DashboardStats {
  totalViews: number
  totalLikes: number
  totalMessages: number
  recentMessages: Message[]
  propertiesStats: {
    total: number
    available: number
    sold: number
    rented: number
  }
  properties: {
    totalProperties: number
    totalSales: number
    totalRentals: number
    totalViews?: number
    totalLikes?: number
    monthlyData: { month: string; sales: number; rentals: number; views?: number }[]
  }
  users: {
    totalUsers: number
    newUsersThisMonth: number
    activeUsers: number
    totalOwners: number
    totalClients: number
  }
  revenue: {
    totalRevenue: number
    monthlyRevenue: number
    projectedRevenue?: number
  }
}

export interface PropertyStats {
  totalProperties: number
  totalSales: number
  totalRentals: number
  monthlyData: { month: string; sales: number; rentals: number }[]
}

export interface UserStats {
  totalUsers: number
  newUsersThisMonth: number
  activeUsers: number
  totalOwners: number
  totalClients: number
}
