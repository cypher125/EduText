'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CreditCard, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { usePaystackPayment } from 'react-paystack'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  })

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Paystack configuration
  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: Math.round(total * 100), // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${formData.firstName} ${formData.lastName}`
        }
      ]
    }
  }

  const initializePayment = usePaystackPayment(config)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Paystack callback functions
  const onSuccess = (reference: any) => {
    console.log('Payment successful:', reference)
    clearCart() // Clear the cart after successful payment
    // Save order to database here
    router.push('/order-success') // Redirect to success page
  }

  const onClose = () => {
    console.log('Payment closed')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    initializePayment(onSuccess, onClose)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-purple-600 text-white mb-4">Checkout</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Purchase</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please fill in your details to complete the purchase.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="md:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ₦{total.toFixed(2)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>{item.title} (x{item.quantity})</span>
                    <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total</span>
                    <span>₦{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full text-center text-sm text-gray-600">
                  <ShieldCheck className="inline-block mr-2 h-4 w-4 text-green-500" />
                  Secured by Paystack
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

