import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  MessageCircle, 
  BarChart3, 
  Plus,
  User,
  LogOut
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { blink } from '@/blink/client'
import type { User } from '@/types'

interface HeaderProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleLogout = () => {
    blink.auth.logout()
  }

  if (loading) {
    return (
      <header className="apple-blur bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
          <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full" />
        </div>
      </header>
    )
  }

  if (!user) {
    return (
      <header className="apple-blur bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Digital Store</h1>
          <Button 
            onClick={() => blink.auth.login()}
            className="apple-button bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full"
          >
            Sign In
          </Button>
        </div>
      </header>
    )
  }

  return (
    <header className="apple-blur bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Digital Store</h1>
          
          <nav className="hidden md:flex items-center space-x-2">
            <Button
              variant={currentView === 'store' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('store')}
              className={`apple-button flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                currentView === 'store' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Store
            </Button>
            
            <Button
              variant={currentView === 'community' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('community')}
              className={`apple-button flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                currentView === 'community' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              Community
            </Button>
            
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dashboard')}
              className={`apple-button flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                currentView === 'dashboard' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange('upload')}
            className="apple-button flex items-center gap-2 px-4 py-2 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Product</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
                    {user.displayName?.[0] || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 apple-shadow rounded-xl border-gray-200" align="end" forceMount>
              <div className="flex items-center justify-start gap-3 p-3">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-gray-900">{user.displayName || 'Creator'}</p>
                  <p className="w-[200px] truncate text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="mx-2 mb-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}