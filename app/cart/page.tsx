'use client'

import { useCart } from '@/components/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart()

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 pt-32">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-purple-600 text-white mb-4">Your Cart</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Review Your Items</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check your selected items before proceeding to checkout.
          </p>
        </motion.div>

        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/catalog">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Browse Textbooks
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="mb-4 bg-white">
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                        <p className="text-gray-600">{item.course} • {item.department}</p>
                        <p className="text-purple-600 font-bold">₦{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-4">Quantity: {item.quantity}</span>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="md:col-span-1">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>₦{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>₦{(total * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total</span>
                    <span>₦{(total * 1.05).toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

