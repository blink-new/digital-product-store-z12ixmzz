import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Download, ArrowLeft, Share2 } from 'lucide-react'
import { blink } from '@/blink/client'
import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/types'

interface SuccessPageProps {
  onBackToStore: () => void
}

export function SuccessPage({ onBackToStore }: SuccessPageProps) {
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionIdParam = urlParams.get('session_id')
    const productIdParam = urlParams.get('product_id')
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
    }
    
    if (productIdParam) {
      // Find product from sample data or localStorage
      const sampleProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
      const foundProduct = sampleProducts.find((p: Product) => p.id === productIdParam)
      
      if (foundProduct) {
        setProduct(foundProduct)
      }
    }
    
    setLoading(false)
  }, [])

  const handleDownload = () => {
    if (product?.fileUrl) {
      window.open(product.fileUrl, '_blank')
    } else {
      toast({
        title: 'Download Not Available',
        description: 'The download link is not available at this time.',
        variant: 'destructive'
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: `I just purchased ${product.title}!`,
          text: `Check out this amazing digital product: ${product.title}`,
          url: window.location.origin
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.origin)
        toast({
          title: 'Link Copied!',
          description: 'Store link copied to clipboard.'
        })
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin)
      toast({
        title: 'Link Copied!',
        description: 'Store link copied to clipboard.'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-6">
        <Card className="bg-white apple-shadow border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase. Your digital product is ready for download.
            </p>
            
            {/* Product Info */}
            {product && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-bold text-green-600 mt-2">${product.price}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-4">
              {product?.fileUrl && (
                <Button 
                  onClick={handleDownload}
                  className="apple-button w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Your Product
                </Button>
              )}
              
              <div className="flex gap-4">
                <Button 
                  onClick={onBackToStore}
                  variant="outline"
                  className="flex-1 apple-button border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Store
                </Button>
                
                <Button 
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1 apple-button border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Store
                </Button>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Need help? Contact our support team
              </p>
              {sessionId && (
                <p className="text-xs text-gray-400">
                  Transaction ID: {sessionId.slice(-8)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}