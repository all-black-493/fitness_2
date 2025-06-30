import { FriendsHeader } from "@/components/friends/friends-header"
import { FriendsList } from "@/components/friends/friends-list"
import { FriendsActivity } from "@/components/friends/friends-activity"
import { FriendSuggestions } from "@/components/friends/friend-suggestions"

export default function FriendsPage() {
  return (
    <div className="p-6 space-y-6">
      <FriendsHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FriendsList />
        </div>
        <div className="lg:col-span-2">
          <FriendsActivity />
        </div>
      </div>
      <FriendSuggestions />
    </div>
  )
}
