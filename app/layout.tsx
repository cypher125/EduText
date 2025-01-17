'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/components/CartContext'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f0f5ed]`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              {!isAdminRoute && <Header />}
              <main className="flex-grow">{children}</main>
              {!isAdminRoute && <Footer />}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

