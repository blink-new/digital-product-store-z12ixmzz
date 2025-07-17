import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Book, Video, FileText, Layout, MoreHorizontal, Trash2, Edit, Eye, DollarSign, ShoppingBag, TrendingUp, Users, Loader2 } from 'lucide-react'
import { blink } from '@/blink/client'
import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/types'

interface AdminDashboardProps {
  onEditProduct?: (product: Product) => void
}

export function AdminDashboard({ onEditProduct }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const categoryIcons = {
    course: Book,
    video: Video,
    ebook: FileText,
    template: Layout
  }

  const categoryColors = {
    course: 'bg-blue-100 text-blue-800',
    video: 'bg-purple-100 text-purple-800',
    ebook: 'bg-green-100 text-green-800',
    template: 'bg-orange-100 text-orange-800'
  }

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      const user = await blink.auth.me()
      
      // For now, load from localStorage until database is available
      const storedProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
      const userProducts = storedProducts.filter((p: Product) => p.creatorId === user.id)
      setProducts(userProducts)
    } catch (error) {
      console.error('Failed to load products:', error)
      toast({
        title: 'Error',
        description: 'Failed to load your products.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadProducts()

    // Listen for product creation events
    const handleProductCreated = () => {
      loadProducts()
    }

    window.addEventListener('productCreated', handleProductCreated)
    return () => window.removeEventListener('productCreated', handleProductCreated)
  }, [loadProducts])

  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeleteLoading(productId)
      
      // Remove from localStorage
      const storedProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
      const updatedProducts = storedProducts.filter((p: Product) => p.id !== productId)
      localStorage.setItem('userProducts', JSON.stringify(updatedProducts))
      
      // Update local state
      setProducts(prev => prev.filter(p => p.id !== productId))
      
      // Trigger a custom event to refresh storefront
      window.dispatchEvent(new CustomEvent('productDeleted', { detail: productId }))
      
      toast({
        title: 'Product Deleted',
        description: 'Your product has been successfully deleted.',
      })
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete the product. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const totalRevenue = products.reduce((sum, product) => sum + product.price, 0)
  const featuredProducts = products.filter(p => p.featured).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Dashboard</h1>
          <p className="text-gray-600">Manage your digital products and track your sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 apple-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 apple-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured Products</p>
                  <p className="text-2xl font-bold text-gray-900">{featuredProducts}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 apple-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 apple-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 rounded-xl p-1">
            <TabsTrigger value="products" className="rounded-lg">Products</TabsTrigger>
            <TabsTrigger value="sales" className="rounded-lg">Sales</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="bg-white border-0 apple-shadow rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Your Products</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-6">Start by uploading your first digital product</p>
                    <Button className="apple-button bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                      Upload Product
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => {
                          const IconComponent = categoryIcons[product.category]
                          return (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {product.imageUrl ? (
                                    <img
                                      src={product.imageUrl}
                                      alt={product.title}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <IconComponent className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900">{product.title}</p>
                                    <p className="text-sm text-gray-500 truncate max-w-xs">
                                      {product.description}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${categoryColors[product.category]} border-0`}>
                                  <IconComponent className="h-3 w-3 mr-1" />
                                  {product.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatPrice(product.price)}
                              </TableCell>
                              <TableCell>
                                {product.featured ? (
                                  <Badge className="bg-yellow-100 text-yellow-800 border-0">
                                    Featured
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="border-0">
                                    Active
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {formatDate(product.createdAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => window.open(product.fileUrl, '_blank')}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View File
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEditProduct?.(product)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Product
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          className="text-red-600 focus:text-red-600"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete Product
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "{product.title}"? This action cannot be undone and will permanently remove the product from your store.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteProduct(product.id)}
                                            disabled={deleteLoading === product.id}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            {deleteLoading === product.id ? (
                                              <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Deleting...
                                              </>
                                            ) : (
                                              <>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                              </>
                                            )}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card className="bg-white border-0 apple-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sales tracking coming soon</h3>
                  <p className="text-gray-600">We're working on comprehensive sales analytics and reporting</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-white border-0 apple-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics coming soon</h3>
                  <p className="text-gray-600">Track your product performance, customer insights, and revenue trends</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}