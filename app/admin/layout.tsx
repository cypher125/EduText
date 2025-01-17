'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ShoppingCart, 
  FileText, 
  Settings, 
  LogOut 
} from 'lucide-react'
import { auth } from '@/services/api'
import AdminProtected from '@/components/AdminProtected'

const navigation = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: <BookOpen className="h-5 w-5" />, label: 'Textbooks', href: '/admin/textbooks' },
  { icon: <Users className="h-5 w-5" />, label: 'Students', href: '/admin/students' },
  { icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders', href: '/admin/orders' },
  { icon: <FileText className="h-5 w-5" />, label: 'Reports', href: '/admin/reports' },
  { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href 
                      ? "bg-purple-50 text-purple-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  )}>
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => auth.logout()}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="ml-64 p-8">
          {children}
        </div>
      </div>
    </AdminProtected>
  )
} 