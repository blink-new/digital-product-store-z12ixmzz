import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Upload, X, FileText, Video, Book, Layout, Image, Loader2 } from 'lucide-react'
import { blink } from '@/blink/client'
import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/types'

interface UploadProductProps {
  onProductCreated?: (product: Product) => void
}

export function UploadProduct({ onProductCreated }: UploadProductProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '' as Product['category'] | '',
    featured: false
  })
  const [productFile, setProductFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  const categoryIcons = {
    course: Book,
    video: Video,
    ebook: FileText,
    template: Layout
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProductFile(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const removeProductFile = () => {
    setProductFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    if (!productFile) {
      toast({
        title: 'Missing Product File',
        description: 'Please upload your digital product file.',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const user = await blink.auth.me()

      // Upload product file
      const productFileUpload = await blink.storage.upload(
        productFile,
        `products/${user.id}/${Date.now()}-${productFile.name}`,
        { upsert: true }
      )

      // Upload image if provided
      let imageUrl = ''
      if (imageFile) {
        const imageUpload = await blink.storage.upload(
          imageFile,
          `product-images/${user.id}/${Date.now()}-${imageFile.name}`,
          { upsert: true }
        )
        imageUrl = imageUpload.publicUrl
      }

      // Create product in database
      const product: Omit<Product, 'id'> = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category as Product['category'],
        featured: formData.featured,
        imageUrl,
        fileUrl: productFileUpload.publicUrl,
        creatorId: user.id,
        createdAt: new Date().toISOString()
      }

      // For now, we'll store in localStorage until database is available
      const existingProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
      const newProduct: Product = {
        ...product,
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      existingProducts.push(newProduct)
      localStorage.setItem('userProducts', JSON.stringify(existingProducts))

      toast({
        title: 'Product Created!',
        description: 'Your digital product has been uploaded successfully.',
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        featured: false
      })
      setProductFile(null)
      setImageFile(null)
      setImagePreview(null)

      onProductCreated?.(newProduct)

      // Trigger a custom event to refresh dashboard if it's open
      window.dispatchEvent(new CustomEvent('productCreated', { detail: newProduct }))

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload product. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Upload Your Product</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your knowledge and start earning by uploading your digital products
          </p>
        </div>

        <Card className="bg-white apple-shadow border-0 rounded-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                      Product Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter your product title"
                      className="h-12 rounded-xl border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                      Price (USD) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="29.99"
                      className="h-12 rounded-xl border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as Product['category'] })}>
                      <SelectTrigger className="h-12 rounded-xl border-gray-300">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4" />
                            Course
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video
                          </div>
                        </SelectItem>
                        <SelectItem value="ebook">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            E-book
                          </div>
                        </SelectItem>
                        <SelectItem value="template">
                          <div className="flex items-center gap-2">
                            <Layout className="h-4 w-4" />
                            Template
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
                        Featured Product
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Featured products appear at the top of the store
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Product Image
                  </Label>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-48 object-cover rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                        <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Upload product image</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Product Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product, what customers will learn or get..."
                  className="min-h-32 rounded-xl border-gray-300 resize-none"
                  required
                />
              </div>

              {/* Product File Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Product File *
                </Label>
                {productFile ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{productFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(productFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeProductFile}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload your digital product</p>
                    <p className="text-xs text-gray-500">PDF, ZIP, MP4, or any file type</p>
                    <input
                      type="file"
                      onChange={handleProductFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={loading}
                  className="apple-button bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Create Product
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}