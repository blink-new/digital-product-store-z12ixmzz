import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, FileText, Book, Layout } from 'lucide-react'
import { CheckoutButton } from './CheckoutButton'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onPurchase?: (product: Product) => void
}

const categoryIcons = {
  course: Book,
  video: Play,
  ebook: FileText,
  template: Layout
}

const categoryColors = {
  course: 'bg-blue-50 text-blue-700 border-blue-200',
  video: 'bg-red-50 text-red-700 border-red-200',
  ebook: 'bg-green-50 text-green-700 border-green-200',
  template: 'bg-purple-50 text-purple-700 border-purple-200'
}

export function ProductCard({ product, onPurchase }: ProductCardProps) {
  const Icon = categoryIcons[product.category]
  
  return (
    <Card className="apple-card group bg-white rounded-2xl apple-shadow hover:apple-shadow-lg border-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mb-3 apple-shadow">
                <Icon className="h-8 w-8" />
              </div>
              <span className="text-sm font-medium capitalize text-gray-600">{product.category}</span>
            </div>
          )}
          
          {product.featured && (
            <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600 text-white font-medium px-3 py-1 rounded-full">
              Featured
            </Badge>
          )}
          
          <Badge 
            variant="secondary" 
            className={`absolute top-4 right-4 ${categoryColors[product.category]} font-medium px-3 py-1 rounded-full border`}
          >
            <Icon className="h-3 w-3 mr-1.5" />
            {product.category}
          </Badge>
        </div>
        
        <div className="p-6">
          <h3 className="font-semibold text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-gray-900 leading-tight">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                ${product.price}
              </span>
              <span className="text-xs text-gray-500 font-medium">One-time purchase</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <CheckoutButton product={product} className="w-full" />
      </CardFooter>
    </Card>
  )
}