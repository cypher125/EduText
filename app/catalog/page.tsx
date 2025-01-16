'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Cart from '@/components/Cart'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Book, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { textbooks as textbooksApi, Textbook } from '@/services/api'

export default function Catalog() {
  const { addItem } = useCart()
  const [textbooksList, setTextbooksList] = useState<Textbook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [departments, setDepartments] = useState<string[]>([])
  const [levels, setLevels] = useState<string[]>([])

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await textbooksApi.getFilters()
        setDepartments(['All Departments', ...response.departments])
        setLevels(['All Levels', ...response.levels])
      } catch (error) {
        console.error('Failed to load filters:', error)
      }
    }
    loadFilters()
  }, [])

  useEffect(() => {
    const loadTextbooks = async () => {
      try {
        const params = {
          department: selectedDepartment !== "All Departments" ? selectedDepartment : undefined,
          level: selectedLevel !== "All Levels" ? selectedLevel : undefined,
          search: searchTerm || undefined
        }
        const data = await textbooksApi.getAll(params)
        setTextbooksList(data)
      } catch (error) {
        console.error('Failed to load textbooks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTextbooks()
  }, [selectedDepartment, selectedLevel, searchTerm])

  const filteredTextbooks = textbooksList

  const pageCount = Math.ceil(filteredTextbooks.length / itemsPerPage)
  const paginatedTextbooks = filteredTextbooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="container mx-auto px-6 pt-32 pb-12">
        {loading ? (
          <div className="text-center">Loading textbooks...</div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-purple-600 text-white mb-4">Browse Textbooks</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">YabaTech Textbook Catalog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find and purchase your required course materials from our comprehensive collection of textbooks.
          </p>
        </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-4xl mx-auto space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search by title, course code, or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white border-gray-200"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatePresence>
                {paginatedTextbooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow bg-white">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="bg-purple-50">
                            {book.course_code}
                          </Badge>
                          {book.is_popular && (
                            <Badge className="bg-orange-500 text-white">Popular</Badge>
                          )}
                          {book.is_new && (
                            <Badge className="bg-blue-500 text-white">New</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{book.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {book.department.name} • Level {book.level}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm">{book.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-purple-600">
                          ₦{Number(book.price).toFixed(2)}
                        </div>
                        <Button 
                          onClick={() => addItem({
                            id: book.id,
                            title: book.title,
                            price: book.price,
                            quantity: 1
                          })}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Book className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  className={currentPage === page ? "bg-purple-600 text-white" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
                variant="outline"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Cart />
              <div className="mt-4">
                <Link href="/checkout">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
