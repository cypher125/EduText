'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/services/api'

interface ApiError {
  response?: {
    status: number;
  };
}

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const profile = await auth.getProfile()
        if (profile.role !== 'admin') {
          throw new Error('Unauthorized')
        }
        setIsAuthorized(true)
      } catch (error: unknown) {
        console.error('Auth check failed:', (error as ApiError)?.response?.status || error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
} 