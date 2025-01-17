'use client'

import { useState, useEffect } from 'react'
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
import { Search, Eye, Mail } from 'lucide-react'
import { orders } from '@/services/api'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  email: string
  matric_number: string
  department: string
  level: string
  total_orders: number
  total_spent: number
  last_purchase: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const ordersData = await orders.getAll()
        
        // Process orders to get unique students with their purchase history
        const studentsMap = new Map()
        
        ordersData.forEach(order => {
          const studentId = order.matric_number
          const existingStudent = studentsMap.get(studentId)
          
          if (existingStudent) {
            studentsMap.set(studentId, {
              ...existingStudent,
              total_orders: existingStudent.total_orders + 1,
              total_spent: existingStudent.total_spent + parseFloat(order.total_amount),
              last_purchase: new Date(order.created_at) > new Date(existingStudent.last_purchase) 
                ? order.created_at 
                : existingStudent.last_purchase
            })
          } else {
            studentsMap.set(studentId, {
              id: studentId,
              name: order.student_name,
              email: order.student_email,
              matric_number: order.matric_number,
              department: order.department,
              level: order.level,
              total_orders: 1,
              total_spent: parseFloat(order.total_amount),
              last_purchase: order.created_at
            })
          }
        })

        setStudents(Array.from(studentsMap.values()))
      } catch (error) {
        console.error('Failed to fetch students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matric_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-500">View students who have purchased textbooks</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Student Purchase History</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Matric Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.matric_number}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.level}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {student.total_orders}
                    </Badge>
                  </TableCell>
                  <TableCell>₦{student.total_spent.toLocaleString()}</TableCell>
                  <TableCell>{new Date(student.last_purchase).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`mailto:${student.email}`}>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/students/${student.matric_number}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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