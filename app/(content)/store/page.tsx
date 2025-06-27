import { StoreHeader } from "@/components/store/store-header"
import { StoreTabs } from "@/components/store/store-tabs"

export default function StorePage() {
  return (
    <div className="p-6 space-y-6">
      <StoreHeader />
      <StoreTabs />
    </div>
  )
}
