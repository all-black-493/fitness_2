"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Smile, Paperclip } from "lucide-react"
import { toast } from "sonner"

interface CommunityChatProps {
  communityId: string
}

export function CommunityChat({ communityId }: CommunityChatProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const messages = [
    {
      id: 1,
      author: "Coach Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "10:30 AM",
      message: "Good morning everyone! Remember to warm up properly before your lifts today 💪",
      isAdmin: true,
    },
    {
      id: 2,
      author: "Mike Strong",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "10:32 AM",
      message: "Thanks coach! Just finished my warm-up sets. Ready to hit some PRs today!",
      isAdmin: false,
    },
    {
      id: 3,
      author: "Sarah Lifter",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "10:35 AM",
      message: "Anyone else struggling with grip strength on deadlifts? Looking for tips",
      isAdmin: false,
    },
    {
      id: 4,
      author: "Alex Power",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "10:37 AM",
      message: "Try chalk or straps! Also farmer's walks helped me a lot with grip strength",
      isAdmin: false,
    },
    {
      id: 5,
      author: "Emma Strong",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "10:40 AM",
      message: "Mixed grip works well too, but be careful about imbalances. Alternate which hand goes over/under",
      isAdmin: false,
    },
  ]

  const onlineMembers = [
    { name: "Coach Johnson", avatar: "/placeholder.svg?height=24&width=24" },
    { name: "Mike Strong", avatar: "/placeholder.svg?height=24&width=24" },
    { name: "Sarah Lifter", avatar: "/placeholder.svg?height=24&width=24" },
    { name: "You", avatar: "/placeholder.svg?height=24&width=24" },
  ]

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsSending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast.success("Message sent!")
    setMessage("")
    setIsSending(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Messages */}
      <div className="lg:col-span-3">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <span>Community Chat</span>
              <Badge variant="outline">{onlineMembers.length} online</Badge>
            </CardTitle>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {msg.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{msg.author}</span>
                    {msg.isAdmin && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm mt-1">{msg.message}</p>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleSendMessage} disabled={isSending || !message.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Online Members */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Online Now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {onlineMembers.map((member, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="relative">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-background" />
                </div>
                <span className="text-sm">{member.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
