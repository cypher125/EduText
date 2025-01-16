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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Add type for Paystack reference
interface PaystackReference {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    matricNo: '',
    department: '',
    level: '',
    programType: '',
  })

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Paystack configuration
  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: Math.round(total * 100), // Convert to kobo
    publicKey: 'pk_test_b7c598a5740fc0d964a012c414e85a72999e41f3',
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${formData.firstName} ${formData.lastName}`
        },
        {
          display_name: "Matric Number",
          variable_name: "matric_no",
          value: formData.matricNo
        },
        {
          display_name: "Department",
          variable_name: "department",
          value: formData.department
        },
        {
          display_name: "Level",
          variable_name: "level",
          value: formData.level
        },
        {
          display_name: "Program Type",
          variable_name: "program_type",
          value: formData.programType
        }
      ]
    },
    currency: 'NGN'
  }

  // Initialize payment outside the handler
  const initializePaystack = usePaystackPayment(config)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const onSuccess = (reference: PaystackReference) => {
    console.log('Payment successful:', reference)
    clearCart()
    router.push('/order-success')
  }

  const onClose = () => {
    console.log('Payment closed')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    initializePaystack({
      onSuccess,
      onClose
    })
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
                  <div>
                    <Label htmlFor="matricNo">Matric Number</Label>
                    <Input 
                      id="matricNo"
                      name="matricNo"
                      value={formData.matricNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      name="department"
                      value={formData.department}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer_science">Computer Science</SelectItem>
                        <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                        {/* Add more departments */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="level">Level</Label>
                      <Select
                        name="level"
                        value={formData.level}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nd1">ND 1</SelectItem>
                          <SelectItem value="nd2">ND 2</SelectItem>
                          <SelectItem value="nd3">ND 3</SelectItem>
                          <SelectItem value="hnd1">HND 1</SelectItem>
                          <SelectItem value="hnd2">HND 2</SelectItem>
                          <SelectItem value="hnd3">HND 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="programType">Program Type</Label>
                      <Select
                        name="programType"
                        value={formData.programType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, programType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fulltime">Full Time</SelectItem>
                          <SelectItem value="parttime">Part Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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

