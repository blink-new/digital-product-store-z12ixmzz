export interface Product {
  id: string
  title: string
  description: string
  price: number
  imageUrl?: string
  fileUrl?: string
  creatorId: string
  createdAt: string
  category: 'course' | 'video' | 'ebook' | 'template'
  featured: boolean
}

export interface Purchase {
  id: string
  productId: string
  userId: string
  amount: number
  stripePaymentId: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: number
}

export interface User {
  id: string
  email: string
  displayName?: string
  avatar?: string
}