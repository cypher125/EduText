'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { textbooks } from '@/services/api'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TextbookDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [textbook, setTextbook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    course_code: '',
    department: '',
    level: '',
    price: '',
    stock: '',
    description: ''
  })

  useEffect(() => {
    if (textbook) {
      setEditForm({
        title: textbook.title,
        course_code: textbook.course_code,
        department: textbook.department,
        level: textbook.level,
        price: textbook.price.toString(),
        stock: textbook.stock.toString(),
        description: textbook.description
      })
    }
  }, [textbook])

  useEffect(() => {
    const fetchTextbook = async () => {
      try {
        const data = await textbooks.getById(params.id as string)
        if (!data) {
          setError('Textbook not found')
          return
        }
        setTextbook(data)
      } catch (error) {
        console.error('Failed to fetch textbook:', error)
        setError('Failed to load textbook details')
      } finally {
        setLoading(false)
      }
    }

    fetchTextbook()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error || !textbook) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">{error || 'Textbook not found'}</p>
        <Link href="/admin/textbooks">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Textbooks
          </Button>
        </Link>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedTextbook = await textbooks.update(params.id as string, editForm)
      setTextbook(updatedTextbook)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update textbook:', error)
      alert('Failed to update textbook. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this textbook?')) {
      try {
        await textbooks.delete(params.id as string);
        router.push('/admin/textbooks');
      } catch (error) {
        console.error('Failed to delete textbook:', error);
        alert('Failed to delete textbook. Please try again.');
      }
    }
  };

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
            onClick={handleEdit}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Textbook</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course_code" className="text-right">Course Code</Label>
                <Input
                  id="course_code"
                  value={editForm.course_code}
                  onChange={(e) => setEditForm({...editForm, course_code: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Department</Label>
                <Select 
                  value={editForm.department}
                  onValueChange={(value) => setEditForm({...editForm, department: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accountancy">Accountancy</SelectItem>
                    <SelectItem value="agricultural_technology">Agricultural Technology</SelectItem>
                    <SelectItem value="architectural_technology">Architectural Technology</SelectItem>
                    <SelectItem value="art_and_design">Art and Design</SelectItem>
                    <SelectItem value="building_technology">Building Technology</SelectItem>
                    <SelectItem value="business_administration">Business Administration</SelectItem>
                    <SelectItem value="chemical_engineering">Chemical Engineering</SelectItem>
                    <SelectItem value="civil_engineering">Civil Engineering</SelectItem>
                    <SelectItem value="computer_engineering">Computer Engineering</SelectItem>
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="electrical_engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="estate_management">Estate Management</SelectItem>
                    <SelectItem value="food_technology">Food Technology</SelectItem>
                    <SelectItem value="hospitality_management">Hospitality Management</SelectItem>
                    <SelectItem value="industrial_maintenance">Industrial Maintenance</SelectItem>
                    <SelectItem value="leisure_and_tourism">Leisure and Tourism</SelectItem>
                    <SelectItem value="marine_engineering">Marine Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="mass_communication">Mass Communication</SelectItem>
                    <SelectItem value="mechanical_engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="metallurgy_engineering">Metallurgy Engineering</SelectItem>
                    <SelectItem value="mineral_and_petroleum">Mineral and Petroleum</SelectItem>
                    <SelectItem value="nutrition_and_dietetics">Nutrition and Dietetics</SelectItem>
                    <SelectItem value="office_technology">Office Technology</SelectItem>
                    <SelectItem value="polymer_and_textile">Polymer and Textile</SelectItem>
                    <SelectItem value="printing_technology">Printing Technology</SelectItem>
                    <SelectItem value="quantity_surveying">Quantity Surveying</SelectItem>
                    <SelectItem value="science_laboratory">Science Laboratory</SelectItem>
                    <SelectItem value="surveying_and_geo">Surveying and Geo-Informatics</SelectItem>
                    <SelectItem value="urban_and_regional">Urban and Regional Planning</SelectItem>
                    <SelectItem value="welding_and_fabrication">Welding and Fabrication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">Level</Label>
                <Select 
                  value={editForm.level}
                  onValueChange={(value) => setEditForm({...editForm, level: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ND1">ND1</SelectItem>
                    <SelectItem value="ND2">ND2</SelectItem>
                    <SelectItem value="HND1">HND1</SelectItem>
                    <SelectItem value="HND2">HND2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 