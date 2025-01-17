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
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import { textbooks } from '@/services/api'

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Textbooks Management</h1>
          <p className="text-gray-500">Manage your textbook inventory and details</p>
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
                {/* Add department options dynamically */}
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
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
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
        <DialogContent className="sm:max-w-[425px]">
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
                />
              </div>
              {/* Add other form fields similarly */}
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