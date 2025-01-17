'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  FileText,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { textbooks, orders } from '@/services/api'
import Link from 'next/link'

interface DashboardStats {
  totalBooks: number
  totalSales: number
  totalRevenue: number
  recentOrders: any[]
  lowStockBooks: any[]
  monthlyRevenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalSales: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockBooks: [],
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [booksData, ordersData] = await Promise.all([
          textbooks.getAll(),
          orders.getAll()
        ])

        // Calculate stats
        const totalBooks = booksData.length
        const totalSales = ordersData.length
        const totalRevenue = ordersData.reduce((sum, order) => 
          sum + parseFloat(order.total_amount), 0
        )

        // Get monthly revenue
        const currentMonth = new Date().getMonth()
        const monthlyRevenue = ordersData
          .filter(order => new Date(order.created_at).getMonth() === currentMonth)
          .reduce((sum, order) => sum + parseFloat(order.total_amount), 0)

        // Get low stock books (less than 10 copies)
        const lowStockBooks = booksData
          .filter(book => book.stock < 10)
          .slice(0, 5)

        // Get recent orders
        const recentOrders = ordersData
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)

        setStats({
          totalBooks,
          totalSales,
          totalRevenue,
          recentOrders,
          lowStockBooks,
          monthlyRevenue
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, Admin</h1>
        <p className="text-gray-500">Manage books, view orders, and monitor key metrics.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<BookOpen />}
          trend={10}
        />
        <StatsCard
          title="Total Sales"
          value={stats.totalSales}
          icon={<ShoppingBag />}
          trend={25}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₦${stats.monthlyRevenue.toLocaleString()}`}
          icon={<TrendingUp />}
          trend={15}
        />
        <StatsCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign />}
          trend={20}
                        />
                      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.reference}</TableCell>
                    <TableCell>{order.student_name}</TableCell>
                    <TableCell>₦{parseFloat(order.total_amount).toLocaleString()}</TableCell>
                        <TableCell>
                      <Badge variant="success">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

        <Card>
              <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                  <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                {stats.lowStockBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.course_code}</TableCell>
                    <TableCell>{book.stock}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Low Stock</Badge>
                    </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
      </div>

      <div className="flex gap-4">
        <Link href="/admin/textbooks">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <BookOpen className="mr-2 h-4 w-4" />
            Manage Books
          </Button>
        </Link>
        <Link href="/admin/orders">
          <Button variant="outline">
            <ShoppingBag className="mr-2 h-4 w-4" />
            View Orders
          </Button>
        </Link>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon, trend }) {
  const isPositive = trend > 0
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
            isPositive ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

