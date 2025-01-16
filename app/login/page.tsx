'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { User, Lock } from 'lucide-react'
import Header from "@/components/Header"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt with:', { email, password })
  }

  return (
    <div className="min-h-screen bg-[#f0f5ed]">
      <Header />
      <motion.div 
        className="container mx-auto px-6 py-8 pt-32 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-[#34480f]">Login to YabaTech EduText Hub</h1>
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4 bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div>
            <Label htmlFor="email" className="flex items-center text-[#34480f]">
              <User className="mr-2" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 border-[#5c8758]"
            />
          </div>
          <div>
            <Label htmlFor="password" className="flex items-center text-[#34480f]">
              <Lock className="mr-2" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 border-[#5c8758]"
            />
          </div>
          <Button type="submit" className="w-full bg-[#5c8758] hover:bg-[#47703e] text-[#f0f5ed]">Login</Button>
        </motion.form>
        <motion.p 
          className="mt-4 text-center text-[#34480f]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Don't have an account? <a href="/register" className="text-[#5c8758] hover:underline">Register here</a>
        </motion.p>
      </motion.div>
    </div>
  )
}

