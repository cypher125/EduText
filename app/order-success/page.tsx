'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OrderSuccessPage() {
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
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
          <div className="space-x-4">
            <Link href="/catalog">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                View Orders
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 