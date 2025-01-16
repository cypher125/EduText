'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, ShoppingCart, Menu } from 'lucide-react'
import { useCart } from '@/components/CartContext'
import { useState, useEffect } from 'react'

export default function Header() {
  const { items } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      className={`px-6 py-4 fixed top-6 left-6 right-6 z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white text-gray-900 shadow-lg rounded-full' 
          : 'bg-transparent text-white'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <nav>
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Book className="h-8 w-8 text-yellow-300" />
            </motion.div>
            <span className="text-2xl font-bold">YabaTech<span className="text-yellow-300">EduText</span></span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" className={`hover:text-yellow-300 transition-colors ${
                isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white'
              } relative`}>
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-300 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              className={`md:hidden hover:text-yellow-300 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 space-y-2"
            >
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

