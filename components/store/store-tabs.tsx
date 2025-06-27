"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupplementsGrid } from "./supplements-grid"
import { ApparelGrid } from "./apparel-grid"
import { EquipmentGrid } from "./equipment-grid"
import { SponsorsSection } from "./sponsors-section"

export function StoreTabs() {
  return (
    <Tabs defaultValue="supplements" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="supplements">Supplements</TabsTrigger>
        <TabsTrigger value="apparel">Apparel</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
        <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
      </TabsList>

      <TabsContent value="supplements">
        <SupplementsGrid />
      </TabsContent>

      <TabsContent value="apparel">
        <ApparelGrid />
      </TabsContent>

      <TabsContent value="equipment">
        <EquipmentGrid />
      </TabsContent>

      <TabsContent value="sponsors">
        <SponsorsSection />
      </TabsContent>
    </Tabs>
  )
}
