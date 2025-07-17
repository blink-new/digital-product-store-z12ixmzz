import { useState, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Star, Shield, Users } from 'lucide-react'
import { blink } from '@/blink/client'
import { sampleProducts } from '@/data/sampleProducts'
import type { Product } from '@/types'

interface StoreFrontProps {
  onPurchase: (product: Product) => void
}

export function StoreFront({ onPurchase }: StoreFrontProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'course', label: 'Courses' },
    { id: 'video', label: 'Videos' },
    { id: 'ebook', label: 'E-books' },
    { id: 'template', label: 'Templates' }
  ]

  useEffect(() => {
    loadProducts()

    // Listen for product creation and deletion events
    const handleProductCreated = () => {
      loadProducts()
    }

    const handleProductDeleted = () => {
      loadProducts()
    }

    window.addEventListener('productCreated', handleProductCreated)
    window.addEventListener('productDeleted', handleProductDeleted)
    
    return () => {
      window.removeEventListener('productCreated', handleProductCreated)
      window.removeEventListener('productDeleted', handleProductDeleted)
    }
  }, [])

  const loadProducts = async () => {
    try {
      // Load sample products and user-uploaded products
      const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
      const allProducts = [...sampleProducts, ...userProducts]
      setProducts(allProducts)
    } catch (error) {
      console.error('Failed to load products:', error)
      setProducts(sampleProducts)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredProducts = filteredProducts.filter(p => p.featured)
  const regularProducts = filteredProducts.filter(p => !p.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl apple-shadow p-6 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl mb-6" />
                <div className="h-5 bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-6" />
                <div className="h-12 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Premium Digital
            <br />
            <span className="text-blue-200">Products</span>
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover high-quality courses, videos, and resources created by expert creators
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-12 text-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5" />
              </div>
              <span className="font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <span className="font-medium">Active Community</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full border-gray-300 bg-white apple-shadow text-gray-900 placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`apple-button px-6 py-2 rounded-full font-medium ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPurchase={onPurchase}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.label}
          </h2>
          
          {regularProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPurchase={onPurchase}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}