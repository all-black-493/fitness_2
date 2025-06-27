import { Sidebar } from "@/components/sidebar"

export default function ContentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-1 min-h-screen">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    )
}