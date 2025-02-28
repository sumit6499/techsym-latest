import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {Toaster} from '@/components/ui/sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Techsymposium - Discover Amazing Events",
  description: "DKTE's largest Techevent",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Toaster />
          <Footer />
        </div>
      </body>
    </html>
  )
}

