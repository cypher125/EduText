'use client'

import { useCart } from '@/components/CartContext'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react'

export default function Cart() {
  const { items, removeItem, clearCart } = useCart()

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 sticky top-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6 text-[#5c8758]" />
        <h2 className="text-2xl font-bold text-[#34480f]">Your Cart</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-[#4a6520] text-center py-8">Your cart is empty.</p>
      ) : (
        <>
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id} 
                className="flex justify-between items-center mb-4 bg-[#f0f5ed] p-4 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h3 className="font-medium text-[#34480f]">{item.title}</h3>
                  <p className="text-sm text-[#4a6520]">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#5c8758]">₦{(item.price * item.quantity).toFixed(2)}</span>
                  <Button 
                    onClick={() => removeItem(item.id)} 
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="border-t border-[#c6dabb] mt-6 pt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-[#34480f]">Total:</span>
              <span className="text-2xl font-bold text-[#5c8758]">₦{total.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full bg-[#5c8758] hover:bg-[#47703e] text-[#f0f5ed]"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Checkout
              </Button>
              <Button 
                onClick={clearCart} 
                variant="outline"
                className="w-full border-[#5c8758] text-[#5c8758] hover:bg-[#c6dabb]"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

