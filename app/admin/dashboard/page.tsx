'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from 'framer-motion'
import { Plus, Minus, FileText, ShoppingBag, Users, BookOpen, TrendingUp, DollarSign, Trash2, Edit, Eye, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { textbooks, orders } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [textbooksList, setTextbooksList] = useState([])
  const [ordersList, setOrdersList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newBook, setNewBook] = useState({ title: '', course: '', price: '', description: '' })
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [textbooksData, ordersData] = await Promise.all([
          textbooks.getAll(),
          orders.getAll()
        ])
        setTextbooksList(textbooksData)
        setOrdersList(ordersData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddBook = () => {
    const bookToAdd = {
      id: textbooksList.length + 1,
      ...newBook,
      price: parseFloat(newBook.price)
    }
    setTextbooksList([...textbooksList, bookToAdd])
    setNewBook({ title: '', course: '', price: '', description: '' })
    setIsAddBookDialogOpen(false)
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setIsAddBookDialogOpen(true)
  }

  const handleUpdateBook = () => {
    const updatedBooks = textbooksList.map(book => 
      book.id === editingBook.id ? editingBook : book
    )
    setTextbooksList(updatedBooks)
    setEditingBook(null)
    setIsAddBookDialogOpen(false)
  }

  const handleDeleteBook = (id) => {
    setTextbooksList(textbooksList.filter(book => book.id !== id))
  }

  const generateReport = () => {
    // In a real application, this would generate a PDF or CSV report
    console.log("Generating report...")
    alert("Report generated and downloaded!")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Access Denied: Admin privileges required</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {loading ? (
        <div>Loading...</div>
      ) : (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 pt-32">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-purple-600 text-white mb-4">Admin Dashboard</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome, Admin</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage books, view orders, and monitor key metrics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Users", value: "1,234", icon: Users, color: "bg-blue-500" },
            { title: "Total Books", value: "567", icon: BookOpen, color: "bg-green-500" },
            { title: "Monthly Sales", value: "₦89,012", icon: TrendingUp, color: "bg-yellow-500" },
            { title: "Revenue", value: "₦123,456", icon: DollarSign, color: "bg-purple-500" },
          ].map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 text-white ${stat.color} rounded-full p-1`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="books" className="space-y-4">
          <TabsList>
            <TabsTrigger value="books">Manage Books</TabsTrigger>
            <TabsTrigger value="orders">View Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="books">
            <Card className="bg-white">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Book Management</CardTitle>
                <Dialog open={isAddBookDialogOpen} onOpenChange={setIsAddBookDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Add New Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                      <DialogDescription>
                        {editingBook ? 'Edit the book details below.' : 'Enter the details of the new book below.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={editingBook ? editingBook.title : newBook.title}
                          onChange={(e) => editingBook ? setEditingBook({...editingBook, title: e.target.value}) : setNewBook({...newBook, title: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="course" className="text-right">
                          Course
                        </Label>
                        <Input
                          id="course"
                          value={editingBook ? editingBook.course : newBook.course}
                          onChange={(e) => editingBook ? setEditingBook({...editingBook, course: e.target.value}) : setNewBook({...newBook, course: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={editingBook ? editingBook.price : newBook.price}
                          onChange={(e) => editingBook ? setEditingBook({...editingBook, price: e.target.value}) : setNewBook({...newBook, price: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={editingBook ? editingBook.description : newBook.description}
                          onChange={(e) => editingBook ? setEditingBook({...editingBook, description: e.target.value}) : setNewBook({...newBook, description: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={editingBook ? handleUpdateBook : handleAddBook}>
                        {editingBook ? 'Update Book' : 'Add Book'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                        {textbooksList.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.course}</TableCell>
                        <TableCell>₦{book.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditBook(book)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book.id)}>
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
          </TabsContent>
          <TabsContent value="orders">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                        {ordersList.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.bookTitle}</TableCell>
                        <TableCell>{order.studentName}</TableCell>
                        <TableCell>{order.level}</TableCell>
                        <TableCell>{order.course}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>₦{order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-x-4">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={generateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline">
            <ShoppingBag className="mr-2 h-4 w-4" />
            View All Orders
          </Button>
        </div>
      </div>
        </div>
      )}
    </div>
  )
}

