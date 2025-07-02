"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window, Thread } from "stream-chat-react"
import { StreamChat } from "stream-chat"
import "stream-chat-react/dist/css/v2/index.css"

interface CommunityChatProps {
  communityId: string
}

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || ""
const DEMO_USER = { id: "demo-user", name: "Demo User" }
const DEMO_TOKEN = "demo-token" // Use dev token for local/dev only

export function CommunityChat({ communityId }: CommunityChatProps) {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [channel, setChannel] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function setup() {
      setLoading(true)
      try {
        const client = StreamChat.getInstance(API_KEY)
        await client.connectUser(DEMO_USER, DEMO_TOKEN)
        const channel = client.channel("livestream", communityId, { name: `Community ${communityId}` })
        await channel.watch()
        setChatClient(client)
        setChannel(channel)
      } catch (err) {
        // TODO: Show error
      } finally {
        setLoading(false)
      }
    }
    setup()
    return () => {
      if (chatClient) chatClient.disconnectUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId])

  if (loading) return <LoadingSkeleton className="h-96 w-full" />
  if (!chatClient || !channel) return null

  return (
    <ErrorBoundary>
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
            <span>Community Chat</span>
            {/* You can add avatars or online count here if desired */}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0 bg-background">
          <div className="h-full flex flex-col">
            <Chat client={chatClient} theme="str-chat__theme-light">
              <Channel channel={channel} thread={null}>
                <Window>
                  {/* Custom ChannelHeader for more control */}
                  <div className="border-b px-4 py-2 flex items-center justify-between bg-white dark:bg-zinc-900">
                    <span className="font-medium">Chat Room</span>
                    {/* TODO: Add avatars/online count if desired */}
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {/* You can customize MessageList with props or custom components */}
                    <MessageList />
                  </div>
                  <div className="border-t p-2 bg-white dark:bg-zinc-900">
                    {/* You can customize MessageInput with props or custom components */}
                    <MessageInput focus />
                  </div>
                </Window>
                <Thread />
              </Channel>
            </Chat>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
