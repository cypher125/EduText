import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/components/CartContext'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YabaTech EduText Hub',
  description: 'Official textbook platform for Yaba College of Technology',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Make headers() call awaitable
  const headersList = await headers()
  const shouldSkipRootLayout = headersList.get('x-middleware-skip-root-layout') === '1'

  if (shouldSkipRootLayout) {
    return <>{children}</>
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f0f5ed]`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}

