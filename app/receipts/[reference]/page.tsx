'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { orders } from '@/services/api'

interface OrderItem {
  title: string
  quantity: number
  price: number
  subtotal: number
}

interface Receipt {
  reference: string
  date: string
  studentName: string
  matricNo: string
  department: string
  level: string
  items: OrderItem[]
  total: number
}

export default function ReceiptPage() {
  const params = useParams()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await orders.getByReference(params.reference as string)
        setReceipt({
          reference: data.reference,
          date: new Date(data.created_at).toLocaleDateString(),
          studentName: data.student_name,
          matricNo: data.matric_number,
          department: data.department,
          level: data.level,
          items: data.items.map((item: any) => ({
            title: item.textbook.title,
            quantity: item.quantity,
            price: parseFloat(item.price),
            subtotal: item.quantity * parseFloat(item.price)
          })),
          total: parseFloat(data.total_amount)
        })
      } catch (error) {
        console.error('Failed to fetch receipt:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.reference) {
      fetchReceipt()
    }
  }, [params.reference])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!receipt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
        <Link href="/" className="text-purple-600 hover:text-purple-700">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl pt-20">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <Button onClick={handlePrint} className="print:hidden">
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
      </div>

      <Card className="bg-white">
        <CardHeader className="text-center border-b">
          <div className="mb-2 text-2xl font-bold">EduText</div>
          <CardTitle className="text-xl">Purchase Receipt</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Receipt Details</h3>
              <p className="text-sm">Reference: {receipt.reference}</p>
              <p className="text-sm">Date: {receipt.date}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Student Information</h3>
              <p className="text-sm">Name: {receipt.studentName}</p>
              <p className="text-sm">Matric No: {receipt.matricNo}</p>
              <p className="text-sm">Department: {receipt.department}</p>
              <p className="text-sm">Level: {receipt.level}</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipt.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">₦{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₦{item.subtotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold">₦{receipt.total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for your purchase!</p>
            <p>For any inquiries, please contact support@edutext.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 