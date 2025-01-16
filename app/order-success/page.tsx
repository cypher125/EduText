'use client'

import { motion } from 'framer-motion'
import { CheckCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('reference') || 'N/A'

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <p className="text-sm text-gray-600">Order Reference:</p>
            <p className="text-lg font-bold text-gray-900">{orderId}</p>
          </div>
          <div className="space-x-4">
            <Link href="/catalog">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Continue Shopping
              </Button>
            </Link>
            <Link href={`/receipt/${orderId}`}>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Receipt
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 