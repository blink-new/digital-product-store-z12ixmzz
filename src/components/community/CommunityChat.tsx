import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Users, MessageCircle } from 'lucide-react'
import { blink } from '@/blink/client'
import type { ChatMessage, User } from '@/types'

export function CommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user?.id) return

    let channel: any = null

    const setupRealtime = async () => {
      try {
        channel = blink.realtime.channel('community-chat')
        await channel.subscribe({
          userId: user.id,
          metadata: { 
            displayName: user.displayName || user.email.split('@')[0],
            email: user.email
          }
        })

        // Listen for new messages
        channel.onMessage((message: any) => {
          if (message.type === 'chat') {
            setMessages(prev => [...prev, {
              id: message.id,
              userId: message.userId,
              userName: message.metadata?.displayName || 'Anonymous',
              message: message.data.text,
              timestamp: message.timestamp
            }])
          }
        })

        // Listen for presence changes
        channel.onPresence((users: any[]) => {
          setOnlineUsers(users.map(u => ({
            id: u.userId,
            email: u.metadata?.email || '',
            displayName: u.metadata?.displayName || 'Anonymous'
          })))
        })

        // Load recent messages
        const recentMessages = await channel.getMessages({ limit: 50 })
        setMessages(recentMessages.map((msg: any) => ({
          id: msg.id,
          userId: msg.userId,
          userName: msg.metadata?.displayName || 'Anonymous',
          message: msg.data.text,
          timestamp: msg.timestamp
        })))

      } catch (error) {
        console.error('Failed to setup realtime:', error)
      } finally {
        setLoading(false)
      }
    }

    setupRealtime()

    return () => {
      channel?.unsubscribe()
    }
  }, [user?.id, user?.displayName, user?.email])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    try {
      await blink.realtime.publish('community-chat', 'chat', {
        text: newMessage,
        timestamp: Date.now()
      }, {
        userId: user.id,
        metadata: { 
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email
        }
      })

      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card className="h-[600px] animate-pulse rounded-2xl apple-shadow">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded-lg w-1/4 mb-2" />
                          <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="animate-pulse rounded-2xl apple-shadow">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded-lg w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full" />
                        <div className="h-4 bg-gray-200 rounded-lg flex-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Community Chat</h1>
          <p className="text-xl text-gray-600 leading-relaxed">Connect with fellow creators and share your experiences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col rounded-2xl apple-shadow border-0 bg-white">
              <CardHeader className="border-b border-gray-100 px-6 py-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  Community Discussion
                  <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full">
                    {messages.length} messages
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-500">Start the conversation and share your thoughts!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex gap-4">
                      <Avatar className="h-10 w-10 apple-shadow">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                          {message.userName[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">
                            {message.userName}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl px-4 py-3">
                          <p className="text-gray-800 leading-relaxed break-words">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              
              <div className="border-t border-gray-100 p-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Share your thoughts..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-12 rounded-full border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 px-4"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="apple-button h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white apple-shadow"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Online Users Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-2xl apple-shadow border-0 bg-white">
              <CardHeader className="px-6 py-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  Online ({onlineUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                {onlineUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No one online</p>
                ) : (
                  onlineUsers.map((onlineUser) => (
                    <div key={onlineUser.id} className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm bg-gray-100 text-gray-700 font-medium">
                          {onlineUser.displayName?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-800 font-medium truncate">
                        {onlineUser.displayName || 'Anonymous'}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="rounded-2xl apple-shadow border-0 bg-white">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-sm text-gray-600 space-y-3 leading-relaxed">
                <p>• Be respectful and supportive</p>
                <p>• Share knowledge and experiences</p>
                <p>• No spam or self-promotion</p>
                <p>• Keep discussions relevant</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}