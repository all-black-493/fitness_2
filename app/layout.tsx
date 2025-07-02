import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitLogger - Your Personal Fitness Tracker",
  description: "Log workouts, track progress, and achieve your fitness goals",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div>
            <main>
              {children}
            </main>
          </div>
          <Toaster
            position="bottom-right"
            expand={false}
            richColors={false}
            closeButton
            toastOptions={{
              style: {
                fontFamily: "inherit",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
