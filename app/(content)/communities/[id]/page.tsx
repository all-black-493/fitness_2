import { CommunityHeader } from "@/components/communities/community-header"
import { CommunityTabs } from "@/components/communities/community-tabs"

interface CommunityPageProps {
  params: {
    id: string
  }
}

export default function CommunityPage({ params }: CommunityPageProps) {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <CommunityHeader communityId={params.id} />
      <CommunityTabs communityId={params.id} />
    </div>
  )
}
