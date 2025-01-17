'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users as UsersIcon, 
  ShoppingCart, 
  FileText, 
  BarChart, 
  Settings, 
  LogOut 
} from 'lucide-react'
import { auth } from '@/services/auth'

const navigation = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    label: 'Textbooks',
    href: '/admin/textbooks',
  },
  {
    icon: <UsersIcon className="h-5 w-5" />,
    label: 'Students',
    href: '/admin/students',
  },
  {
    icon: <ShoppingCart className="h-5 w-5" />,
    label: 'Orders',
    href: '/admin/orders',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: 'Reports',
    href: '/admin/reports',
  },
  {
    icon: <BarChart className="h-5 w-5" />,
    label: 'Analytics',
    href: '/admin/analytics',
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: 'Settings',
    href: '/admin/settings',
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r flex flex-col transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[250px]"
      )}>
        <div className="p-6">
          <h1 className={cn(
            "font-bold transition-all duration-300",
            isCollapsed ? "text-sm" : "text-xl"
          )}>
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 px-3">
          {navigation.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                pathname === item.href ? "bg-gray-100 text-gray-900" : "",
                isCollapsed ? "justify-center" : ""
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <Button 
            variant="outline" 
            className={cn(
              "w-full justify-start gap-2",
              isCollapsed ? "justify-center" : ""
            )}
            onClick={() => auth.logout()}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </div>
    </div>
  )
} 