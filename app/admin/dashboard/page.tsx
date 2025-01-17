'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { textbooks, orders, reports } from '@/services/api'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

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
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleDownloadReport = async () => {
    try {
      const blob = await reports.getLowStockReport();
      
      // Create a blob URL
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `low-stock-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download the report. Please try again.');
    }
  };

  const filteredLowStockBooks = stats.lowStockBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 pb-8">
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alert</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadReport}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by title or course code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-4">
              {filteredLowStockBooks.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.course_code}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm font-medium">Stock: {book.stock}</p>
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                      Low Stock
                    </Badge>
                  </div>
                </div>
              ))}
              {filteredLowStockBooks.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  {searchTerm ? 'No matching books found' : 'No low stock items'}
                </p>
              )}
            </div>
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

