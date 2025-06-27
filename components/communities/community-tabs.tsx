"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunityPosts } from "./community-posts"
import { CommunityMembers } from "./community-members"
import { CommunityChat } from "./community-chat"
import { CommunityAbout } from "./community-about"

interface CommunityTabsProps {
  communityId: string
}

export function CommunityTabs({ communityId }: CommunityTabsProps) {
  return (
    <Tabs defaultValue="posts" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <CommunityPosts communityId={communityId} />
      </TabsContent>

      <TabsContent value="members">
        <CommunityMembers communityId={communityId} />
      </TabsContent>

      <TabsContent value="chat">
        <CommunityChat communityId={communityId} />
      </TabsContent>

      <TabsContent value="about">
        <CommunityAbout communityId={communityId} />
      </TabsContent>
    </Tabs>
  )
}
