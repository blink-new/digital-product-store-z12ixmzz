import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { StoreFront } from '@/components/store/StoreFront'
import { CommunityChat } from '@/components/community/CommunityChat'
import { UploadProduct } from '@/components/store/UploadProduct'
import { SuccessPage } from '@/components/store/SuccessPage'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { Toaster } from '@/components/ui/toaster'
import type { Product } from '@/types'

function App() {
  const [currentView, setCurrentView] = useState('store')

  // Check if we're on the success page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('session_id')) {
      setCurrentView('success')
    }
  }, [])

  const handlePurchase = (product: Product) => {
    // This is now handled by CheckoutButton component
    console.log('Purchase product:', product)
  }

  const handleProductCreated = (product: Product) => {
    console.log('Product created:', product)
    setCurrentView('store')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'store':
        return <StoreFront onPurchase={handlePurchase} />
      case 'community':
        return <CommunityChat />
      case 'dashboard':
        return <AdminDashboard onEditProduct={(product) => {
          // TODO: Implement edit functionality
          console.log('Edit product:', product)
        }} />
      case 'upload':
        return <UploadProduct onProductCreated={handleProductCreated} />
      case 'success':
        return <SuccessPage onBackToStore={() => setCurrentView('store')} />
      default:
        return <StoreFront onPurchase={handlePurchase} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
      <Toaster />
    </div>
  )
}

export default App