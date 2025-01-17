'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, X, Calendar } from 'lucide-react'
import { orders, textbooks } from '@/services/api'
import { Badge } from '@/components/ui/badge'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface Filter {
  type: string
  value: string
}

interface DateRange {
  from: Date
  to: Date
}

export default function ReportsPage() {
  const [ordersData, setOrdersData] = useState([])
  const [textbooksData, setTextbooksData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<Filter[]>([])
  
  const [filterOptions, setFilterOptions] = useState({
    levels: new Set(),
    departments: new Set(),
    courses: new Set(),
    titles: new Set()
  })

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    to: new Date()
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResult, textbooksResult] = await Promise.all([
          orders.getAll(),
          textbooks.getAll()
        ])
        
        setOrdersData(ordersResult)
        setTextbooksData(textbooksResult)
        
        // Extract unique filter options
        const options = {
          levels: new Set(ordersResult.map(order => order.level)),
          departments: new Set(ordersResult.map(order => order.department)),
          courses: new Set(textbooksResult.map(book => book.course_code)),
          titles: new Set(textbooksResult.map(book => book.title))
        }
        
        setFilterOptions(options)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const addFilter = (type: string, value: string) => {
    // Don't add if already exists
    if (!activeFilters.some(f => f.type === type && f.value === value)) {
      setActiveFilters([...activeFilters, { type, value }])
    }
  }

  const removeFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index))
  }

  const getFilteredData = () => {
    return ordersData.filter(order => {
      const orderDate = new Date(order.created_at)
      const isInDateRange = orderDate >= dateRange.from && orderDate <= dateRange.to

      return isInDateRange && activeFilters.every(filter => {
        if (filter.value === 'all') return true
        
        switch (filter.type) {
          case 'level':
            return order.level === filter.value
          case 'department':
            return order.department === filter.value
          case 'course':
            return order.items.some(item => item.course_code === filter.value)
          case 'title':
            return order.items.some(item => item.title === filter.value)
          default:
            return true
        }
      })
    })
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    const filteredData = getFilteredData()
    
    // Add report header
    doc.setFontSize(18)
    doc.text('Sales Report', 14, 22)
    
    // Add period
    doc.setFontSize(12)
    doc.text(`Period: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`, 14, 32)
    
    // Add filters
    let yPos = 42
    activeFilters.forEach((filter) => {
      doc.text(`${filter.type}: ${filter.value}`, 14, yPos)
      yPos += 8
    })
    
    // Add summary
    doc.text('Summary:', 14, yPos + 8)
    const totalOrders = filteredData.length
    const totalRevenue = filteredData.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
    const totalBooks = filteredData.reduce((sum, order) => sum + order.items.length, 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    doc.text(`Total Orders: ${totalOrders}`, 14, yPos + 16)
    doc.text(`Total Revenue: ₦${totalRevenue.toLocaleString()}`, 14, yPos + 24)
    doc.text(`Total Books Sold: ${totalBooks}`, 14, yPos + 32)
    doc.text(`Average Order Value: ₦${avgOrderValue.toLocaleString()}`, 14, yPos + 40)
    
    // Add table
    doc.autoTable({
      head: [['Reference', 'Student', 'Department', 'Level', 'Amount', 'Date']],
      body: filteredData.map(order => [
        order.reference,
        order.student_name,
        order.department,
        order.level,
        `₦${parseFloat(order.total_amount).toLocaleString()}`,
        new Date(order.created_at).toLocaleDateString()
      ]),
      startY: yPos + 50
    })
    
    // Save PDF
    doc.save(`sales-report-${new Date().toISOString()}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <p className="text-gray-500">Generate and download filtered sales reports</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <CardTitle>Sales Report</CardTitle>
              <Button onClick={generatePDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
              {['level', 'department', 'course', 'title'].map((filterType) => (
                <Select 
                  key={filterType} 
                  onValueChange={(value) => addFilter(filterType, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={`Filter by ${filterType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filterType}s</SelectItem>
                    {Array.from(filterOptions[`${filterType}s` as keyof typeof filterOptions]).map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {filter.type}: {filter.value}
                    <button 
                      onClick={() => removeFilter(index)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredData().map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.reference}</TableCell>
                  <TableCell>{order.student_name}</TableCell>
                  <TableCell>{order.department}</TableCell>
                  <TableCell>{order.level}</TableCell>
                  <TableCell>₦{parseFloat(order.total_amount).toLocaleString()}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 