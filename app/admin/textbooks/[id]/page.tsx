'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { textbooks } from '@/services/api'
import Link from 'next/link'

export default function TextbookDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [textbook, setTextbook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTextbook = async () => {
      try {
        const data = await textbooks.getById(params.id)
        setTextbook(data)
      } catch (error) {
        console.error('Failed to fetch textbook:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTextbook()
  }, [params.id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this textbook?')) {
      try {
        await textbooks.delete(params.id)
        router.push('/admin/textbooks')
      } catch (error) {
        console.error('Failed to delete textbook:', error)
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (!textbook) return <div>Textbook not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/textbooks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{textbook.title}</h1>
            <p className="text-gray-500">Textbook Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => router.push(`/admin/textbooks/edit/${params.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Course Code</label>
              <p>{textbook.course_code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p>{textbook.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Level</label>
              <p>{textbook.level} Level</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Price</label>
              <p className="text-2xl font-bold text-purple-600">
                ₦{parseFloat(textbook.price).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Stock Status</label>
              <div className="flex items-center space-x-2">
                <Badge variant={textbook.stock > 0 ? "success" : "destructive"}>
                  {textbook.stock > 0 ? 'Available' : 'Out of Stock'}
                </Badge>
                <span>{textbook.stock} units</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 whitespace-pre-wrap">{textbook.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 