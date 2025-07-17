import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard } from 'lucide-react'
import { blink } from '@/blink/client'
import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/types'

interface CheckoutButtonProps {
  product: Product
  className?: string
}

export function CheckoutButton({ product, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const user = await blink.auth.me()
      
      // Create Stripe checkout session
      const response = await blink.data.fetch({
        url: 'https://api.stripe.com/v1/checkout/sessions',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{STRIPE_SECRET_KEY}}',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][product_data][name]': product.title,
          'line_items[0][price_data][product_data][description]': product.description,
          'line_items[0][price_data][unit_amount]': Math.round(product.price * 100).toString(),
          'line_items[0][quantity]': '1',
          'mode': 'payment',
          'success_url': `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&product_id=${product.id}`,
          'cancel_url': window.location.href,
          'customer_email': user.email || '',
          'allow_promotion_codes': 'true',
          'metadata[product_id]': product.id,
          'metadata[user_id]': user.id
        }).toString()
      })

      if (response.status === 200) {
        const session = response.body
        // Redirect to Stripe checkout
        window.location.href = session.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Checkout Error',
        description: 'Failed to start checkout process. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleCheckout}
      disabled={loading}
      className={`apple-button bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-200 apple-shadow ${className}`}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Buy Now - ${product.price}
        </>
      )}
    </Button>
  )
}