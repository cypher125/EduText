'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ReceiptLookupPage() {
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!reference.trim()) {
      setError('Please enter a reference number')
      return
    }

    // Redirect to the receipt page with the reference
    router.push(`/receipts/${reference.trim()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="bg-white">
          <CardHeader className="text-center space-y-2">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <CardTitle className="text-2xl font-bold">Find Your Receipt</CardTitle>
            <p className="text-gray-500">
              Enter your order reference number to view and download your receipt
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Enter reference number..."
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                View Receipt
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 