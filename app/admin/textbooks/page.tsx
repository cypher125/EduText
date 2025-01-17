'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Eye, Trash2, ArrowLeft } from 'lucide-react'
import { textbooks } from '@/services/api'
import Link from 'next/link'

export default function TextbooksPage() {
  const [textbooksList, setTextbooksList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTextbook, setEditingTextbook] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    course_code: '',
    department: '',
    level: '',
    price: '',
    description: '',
    stock: ''
  })

  useEffect(() => {
    fetchTextbooks()
  }, [])

  const fetchTextbooks = async () => {
    try {
      const data = await textbooks.getAll()
      setTextbooksList(data)
    } catch (error) {
      console.error('Failed to fetch textbooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingTextbook(null)
    setFormData({
      title: '',
      course_code: '',
      department: '',
      level: '',
      price: '',
      description: '',
      stock: ''
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (textbook) => {
    setEditingTextbook(textbook)
    setFormData({
      title: textbook.title,
      course_code: textbook.course_code,
      department: textbook.department,
      level: textbook.level,
      price: textbook.price.toString(),
      description: textbook.description,
      stock: textbook.stock.toString()
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTextbook) {
        // Update existing textbook
        await textbooks.update(editingTextbook.id, formData)
      } else {
        // Create new textbook
        await textbooks.create(formData)
      }
      fetchTextbooks()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save textbook:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this textbook?')) {
      try {
        await textbooks.delete(id)
        fetchTextbooks()
      } catch (error) {
        console.error('Failed to delete textbook:', error)
      }
    }
  }

  const filteredTextbooks = textbooksList.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.course_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'All' || book.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Textbooks</h1>
            <p className="text-gray-500">Manage your textbook inventory</p>
              </div>
              </div>
        <Button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Textbook
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Search textbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {/* School of Technology */}
                <SelectItem value="computer_science">Computer Science</SelectItem>
                <SelectItem value="food_technology">Food Technology</SelectItem>
                <SelectItem value="science_laboratory">Science Laboratory Technology</SelectItem>
                <SelectItem value="hospitality_management">Hospitality Management</SelectItem>
                <SelectItem value="nutrition_dietetics">Nutrition and Dietetics</SelectItem>
                <SelectItem value="leisure_tourism">Leisure and Tourism</SelectItem>
                
                {/* School of Engineering */}
                <SelectItem value="computer_engineering">Computer Engineering</SelectItem>
                <SelectItem value="civil_engineering">Civil Engineering</SelectItem>
                <SelectItem value="electrical_engineering">Electrical/Electronic</SelectItem>
                <SelectItem value="mechanical_engineering">Mechanical Engineering</SelectItem>
                <SelectItem value="chemical_engineering">Chemical Engineering</SelectItem>
                <SelectItem value="metallurgical_engineering">Metallurgical Engineering</SelectItem>
                
                {/* Continue with other departments as above */}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTextbooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.course_code}</TableCell>
                  <TableCell>{book.department}</TableCell>
                  <TableCell>₦{parseFloat(book.price).toFixed(2)}</TableCell>
                  <TableCell>{book.stock}</TableCell>
                  <TableCell>
                    <Badge variant={book.stock > 0 ? "success" : "destructive"}>
                      {book.stock > 0 ? 'Available' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(book)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Link href={`/admin/textbooks/${book.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingTextbook ? 'Edit Textbook' : 'Add New Textbook'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course_code" className="text-right">Course Code</Label>
                <Input
                  id="course_code"
                  value={formData.course_code}
                  onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Department</Label>
                <Select 
                  value={formData.department}
                  onValueChange={(value) => setFormData({...formData, department: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* School of Technology */}
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="food_technology">Food Technology</SelectItem>
                    <SelectItem value="science_laboratory">Science Laboratory Technology</SelectItem>
                    <SelectItem value="hospitality_management">Hospitality Management Technology</SelectItem>
                    <SelectItem value="nutrition_dietetics">Nutrition and Dietetics</SelectItem>
                    <SelectItem value="leisure_tourism">Leisure and Tourism Management</SelectItem>
                    
                    {/* School of Engineering */}
                    <SelectItem value="computer_engineering">Computer Engineering</SelectItem>
                    <SelectItem value="civil_engineering">Civil Engineering</SelectItem>
                    <SelectItem value="electrical_engineering">Electrical/Electronic Engineering</SelectItem>
                    <SelectItem value="mechanical_engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="chemical_engineering">Chemical Engineering</SelectItem>
                    <SelectItem value="metallurgical_engineering">Metallurgical Engineering</SelectItem>
                    
                    {/* School of Management */}
                    <SelectItem value="accountancy">Accountancy</SelectItem>
                    <SelectItem value="banking_finance">Banking and Finance</SelectItem>
                    <SelectItem value="business_admin">Business Administration</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="office_technology">Office Technology Management</SelectItem>
                    
                    {/* School of Liberal Studies */}
                    <SelectItem value="mass_comm">Mass Communication</SelectItem>
                    <SelectItem value="arts_design">Arts and Design</SelectItem>
                    <SelectItem value="music_technology">Music Technology</SelectItem>
                    
                    {/* School of Environmental Studies */}
                    <SelectItem value="architecture">Architecture</SelectItem>
                    <SelectItem value="building_technology">Building Technology</SelectItem>
                    <SelectItem value="quantity_surveying">Quantity Surveying</SelectItem>
                    <SelectItem value="urban_planning">Urban and Regional Planning</SelectItem>
                    
                    {/* School of Art, Design and Printing */}
                    <SelectItem value="printing_technology">Printing Technology</SelectItem>
                    <SelectItem value="graphics_design">Graphics Design</SelectItem>
                    <SelectItem value="industrial_design">Industrial Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">Level</Label>
                <Select 
                  value={formData.level}
                  onValueChange={(value) => setFormData({...formData, level: value})}
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
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingTextbook ? 'Update Textbook' : 'Add Textbook'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 