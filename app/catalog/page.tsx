'use client'

import { useState } from 'react'
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
import { Search, Book, BookOpen, GraduationCap, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const textbooks = [
  { 
    id: 1, 
    title: "Engineering Mathematics",
    course: "MTH101",
    department: "Engineering",
    level: "100",
    price: 59.99,
    image: "/placeholder.svg",
    description: "Comprehensive guide to fundamental mathematical concepts in engineering.",
    rating: 4.5,
    popular: true
  },
  { 
    id: 2, 
    title: "Technical Drawing",
    course: "MEC101",
    department: "Mechanical Engineering",
    level: "100",
    price: 69.99,
    image: "/placeholder.svg",
    description: "Essential principles and practices of technical drawing and design.",
    rating: 4.8,
    new: true
  },
  { 
    id: 3, 
    title: "Introduction to Computing",
    course: "COM101",
    department: "Computer Science",
    level: "100",
    price: 49.99,
    image: "/placeholder.svg",
    description: "Fundamental concepts of computer science and programming.",
    rating: 4.7,
    popular: true
  },
  { 
    id: 4, 
    title: "Business Communication",
    course: "BUS201",
    department: "Business Administration",
    level: "200",
    price: 54.99,
    image: "/placeholder.svg",
    description: "Professional communication skills for business environments.",
    rating: 4.6,
    new: true
  },
  { 
    id: 5, 
    title: "Organic Chemistry",
    course: "CHM201",
    department: "Chemistry",
    level: "200",
    price: 64.99,
    image: "/placeholder.svg",
    description: "In-depth study of organic compounds and their reactions.",
    rating: 4.4,
    popular: true
  },
  { 
    id: 6, 
    title: "Principles of Economics",
    course: "ECO101",
    department: "Economics",
    level: "100",
    price: 52.99,
    image: "/placeholder.svg",
    description: "Introduction to microeconomics and macroeconomics principles.",
    rating: 4.5,
    new: true
  },
  { 
    id: 7, 
    title: "Introduction to Psychology",
    course: "PSY101",
    department: "Psychology",
    level: "100",
    price: 48.99,
    image: "/placeholder.svg",
    description: "Overview of basic concepts and theories in psychology.",
    rating: 4.6,
    popular: true
  },
  { 
    id: 8, 
    title: "Fundamentals of Nursing",
    course: "NUR101",
    department: "Nursing",
    level: "100",
    price: 72.99,
    image: "/placeholder.svg",
    description: "Essential knowledge and skills for aspiring nurses.",
    rating: 4.9,
    new: true
  },
  { 
    id: 9, 
    title: "Introduction to Law",
    course: "LAW101",
    department: "Law",
    level: "100",
    price: 67.99,
    image: "/placeholder.svg",
    description: "Basic principles and concepts of legal systems.",
    rating: 4.7,
    popular: true
  },
  { 
    id: 10, 
    title: "Digital Electronics",
    course: "EEE201",
    department: "Electrical Engineering",
    level: "200",
    price: 59.99,
    image: "/placeholder.svg",
    description: "Fundamentals of digital circuits and systems.",
    rating: 4.5,
    new: true
  },
]

const departments = ["All Departments", "Engineering", "Computer Science", "Business Administration", "Mechanical Engineering", "Chemistry", "Economics", "Psychology", "Nursing", "Law", "Electrical Engineering"]
const levels = ["All Levels", "100", "200", "300", "400"]

export default function Catalog() {
  const { addItem } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredTextbooks = textbooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "All Departments" || book.department === selectedDepartment
    const matchesLevel = selectedLevel === "All Levels" || book.level === selectedLevel

    return matchesSearch && matchesDepartment && matchesLevel
  })

  const pageCount = Math.ceil(filteredTextbooks.length / itemsPerPage)
  const paginatedTextbooks = filteredTextbooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="container mx-auto px-6 pt-32 pb-12">
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
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
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
                            {book.course}
                          </Badge>
                          {book.popular && (
                            <Badge className="bg-orange-500 text-white">Popular</Badge>
                          )}
                          {book.new && (
                            <Badge className="bg-blue-500 text-white">New</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{book.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {book.department} • Level {book.level}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm">{book.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-purple-600">
                          ₦{book.price.toFixed(2)}
                        </div>
                        <Button 
                          onClick={() => addItem(book)}
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

