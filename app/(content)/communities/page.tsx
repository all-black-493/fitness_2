import { CommunitiesHeader } from "@/components/communities/communities-header"
import { CommunitiesList } from "@/components/communities/communities-list"

export default function CommunitiesPage() {
  return (
    <div className="p-6 space-y-6">
      <CommunitiesHeader />
      <CommunitiesList />
    </div>
  )
}
