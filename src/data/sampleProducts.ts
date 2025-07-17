import type { Product } from '@/types'

export const sampleProducts: Product[] = [
  {
    id: 'prod_1',
    title: 'Complete React Mastery Course',
    description: 'Master React from basics to advanced concepts. Build real-world projects and learn best practices used by top companies.',
    price: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
    fileUrl: '',
    creatorId: 'creator_1',
    createdAt: new Date().toISOString(),
    category: 'course',
    featured: true
  },
  {
    id: 'prod_2',
    title: 'Advanced JavaScript Patterns',
    description: 'Deep dive into JavaScript design patterns, closures, and advanced concepts that will make you a better developer.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&h=300&fit=crop',
    fileUrl: '',
    creatorId: 'creator_1',
    createdAt: new Date().toISOString(),
    category: 'video',
    featured: true
  },
  {
    id: 'prod_3',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of great design. Create beautiful, user-friendly interfaces that convert.',
    price: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    fileUrl: '',
    creatorId: 'creator_2',
    createdAt: new Date().toISOString(),
    category: 'course',
    featured: false
  },
  {
    id: 'prod_4',
    title: 'The Complete Guide to Node.js',
    description: 'Build scalable backend applications with Node.js. Learn Express, databases, authentication, and deployment.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
    fileUrl: '',
    creatorId: 'creator_1',
    createdAt: new Date().toISOString(),
    category: 'ebook',
    featured: false
  },
  {
    id: 'prod_5',
    title: 'Modern CSS Grid & Flexbox',
    description: 'Master modern CSS layout techniques. Build responsive designs that work on all devices.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
    fileUrl: '',
    creatorId: 'creator_3',
    createdAt: new Date().toISOString(),
    category: 'video',
    featured: false
  },
  {
    id: 'prod_6',
    title: 'Landing Page Templates Pack',
    description: 'Professional landing page templates for SaaS, e-commerce, and service businesses. Ready to customize.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
    fileUrl: '',
    creatorId: 'creator_2',
    createdAt: new Date().toISOString(),
    category: 'template',
    featured: false
  }
]