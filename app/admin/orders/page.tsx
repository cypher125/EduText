'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, Search } from 'lucide-react'

const initialOrders = [
  {
    id: 1,
    reference: "REF123456",
    studentName: "John Doe",
    matricNo: "2021/123456",
    department: "Computer Science",
    level: "ND 2",
    programType: "Full Time",
    items: [
      { title: "Engineering Mathematics", quantity: 1, price: 5999 }
    ],
    total: 5999,
    date: "2024-03-15",
    status: "Completed"
  },
  // Add more orders as needed
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = orders.filter(order =>
    order.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.reference.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-500">View and manage student orders</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Orders</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Matric No</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.reference}</TableCell>
                  <TableCell>{order.studentName}</TableCell>
                  <TableCell>{order.matricNo}</TableCell>
                  <TableCell>{order.department}</TableCell>
                  <TableCell>{order.level}</TableCell>
                  <TableCell>₦{order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Completed' ? 'success' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 