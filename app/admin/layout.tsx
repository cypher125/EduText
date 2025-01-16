'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Book,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  BarChart3,
  HelpCircle,
  LogOut
} from 'lucide-react'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Book, label: 'Textbooks', href: '/admin/textbooks' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: FileText, label: 'Reports', href: '/admin/reports' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <div className="flex h-screen">
            <motion.aside
              initial={false}
              animate={{ width: isCollapsed ? 80 : 250 }}
              className="fixed left-0 top-0 h-screen bg-white shadow-lg z-30"
            >
              <div className="p-4 flex justify-between items-center border-b">
                <span className={`font-bold text-xl ${isCollapsed ? 'hidden' : 'block'}`}>
                  Admin Panel
                </span>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  {isCollapsed ? '→' : '←'}
                </button>
              </div>
              
              <nav className="mt-6">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className={`ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-8 w-full px-4">
                <Link href="/" className="block">
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span className={`ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
                      Exit Admin
                    </span>
                  </div>
                </Link>
              </div>
            </motion.aside>

            <main 
              className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} p-8 overflow-auto`}
              style={{ height: '100vh' }}
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
} 