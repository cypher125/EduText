'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Book, GraduationCap, Library, BookOpen, Clock, TabletIcon as DeviceTablet, Shield, Download, CheckCircle, TrendingUp, Users, BookMarked, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Header from "@/components/Header"
import { useRef, useEffect, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

// Update the interface for courses
interface FeaturedCourse {
  id: number | string
  title: string
  department: string
  level: string
  price: number
  stock: number
  popular?: boolean
  new?: boolean
}

// Add this new component for number animation
function AnimatedCounter({ from, to, duration = 2, className = "" }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(nodeRef, { once: true })

  useEffect(() => {
    if (inView && nodeRef.current) {
      const node = nodeRef.current
      const controls = animate(from, to, {
        duration,
        onUpdate(value) {
          node.textContent = value.toLocaleString('en-US')
        },
      })
      return () => controls.stop()
    }
  }, [from, to, duration, inView])

  return <span ref={nodeRef}>{from}</span>
}

// Update the featured courses section
const FeaturedCourses = () => {
  const [courses, setCourses] = useState<FeaturedCourse[]>([])

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await textbooks.getAll()
        // Filter and transform the data for featured courses
        const featuredCourses = response
          .filter(book => book.stock > 0) // Only show in-stock books
          .slice(0, 4) // Limit to 4 featured courses
          .map(book => ({
            id: book.id.toString(),
            title: book.title,
            department: book.department,
            level: `${book.level} Level`, // Format the level correctly
            price: parseFloat(book.price),
            stock: book.stock,
            popular: book.stock < 20, // Mark as popular if stock is getting low
            new: new Date(book.created_at).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000) // Mark as new if added in last 30 days
          }))
        setCourses(featuredCourses)
      } catch (error) {
        console.error('Failed to fetch featured courses:', error)
      }
    }

    fetchFeaturedCourses()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-r from-teal-500 to-blue-600">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">Featured Textbooks</Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Popular Course Materials
          </h2>
          <p className="text-gray-100">
            Discover the most sought-after textbooks across different departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Card className="h-full bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant={course.level.includes('100') ? 'default' : 'secondary'}>
                      {course.level}
                    </Badge>
                    <div className="space-x-2">
                      {course.popular && (
                        <Badge variant="destructive">Popular</Badge>
                      )}
                      {course.new && (
                        <Badge variant="secondary">New</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4">{course.title}</CardTitle>
                  <CardDescription>{course.department}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-purple-600">
                      ₦{course.price.toLocaleString()}
                    </p>
                    <Link href={`/catalog?book=${course.id}`}>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  // Bouncing animation configuration
  const bounceTransition = {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <motion.div 
        ref={targetRef}
        style={{ opacity, scale }}
        className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/henrique-ferreira-AP5-7Zqtf6Y-unsplash.jpg-DyWAM0gizA0m3gcm7OPl5L8gyyqJhi.jpeg')`,
          }}
        ></div>
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 opacity-70"
        ></div>
        <div className="container mx-auto px-6 py-32 mt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <Badge className="bg-yellow-300 text-gray-900 mb-4 px-4 py-1">Official YabaTech Platform</Badge>
              <h1 className="text-6xl font-bold mb-6 leading-tight">Your Academic Success Starts Here</h1>
              <p className="text-xl mb-8 opacity-90">Access all your required textbooks and study materials in one place. Join thousands of YabaTech students already using our platform.</p>
              <div className="space-x-4">
                <Link href="/catalog">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white transition-colors">
                    <Library className="mr-2" />
                    Browse Textbooks
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 transition-colors">
                    <GraduationCap className="mr-2" />
                    Staff Portal
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle className="text-yellow-300" />
                  <span>24/7 Access</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CheckCircle className="text-yellow-300" />
                  <span>Offline Reading</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <CheckCircle className="text-yellow-300" />
                  <span>Regular Updates</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Logo with bouncing animation */}
            <motion.div
              className="w-full max-w-[300px] md:max-w-[400px]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [-20, 20]
              }}
              transition={{
                ...bounceTransition,
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 }
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logoyct-jnTGCsWnpmZPBd6J5N9QUCydgd4lDn.png"
                alt="YabaTech Logo"
                width={400}
                height={400}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: 10000, label: "Active Students", icon: Users },
              { number: 1000, label: "Textbooks", icon: BookMarked },
              { number: 50, label: "Departments", icon: Library },
              { number: 95, label: "Satisfaction Rate", icon: TrendingUp, suffix: "%" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-teal-600" />
                <h3 className="text-3xl font-bold mb-2 text-gray-800">
                  <AnimatedCounter from={0} to={stat.number} duration={2} />
                  {stat.suffix}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-600 text-white mb-4">Platform Features</Badge>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Everything You Need to Excel</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform is designed specifically for YabaTech students, providing all the tools and resources you need for academic success.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DeviceTablet,
                title: "Multi-Device Access",
                description: "Read your textbooks on any device, anywhere, anytime"
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Access your materials round the clock without interruption"
              },
              {
                icon: Download,
                title: "Offline Access",
                description: "Download textbooks for offline reading when needed"
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description: "Your academic materials are safe and protected"
              },
              {
                icon: BookOpen,
                title: "Interactive Content",
                description: "Engage with interactive study materials and quizzes"
              },
              {
                icon: Library,
                title: "Vast Library",
                description: "Access to all required course materials in one place"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-shadow border border-gray-200"
              >
                <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <FeaturedCourses />

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-yellow-300 text-gray-900 mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Hear from fellow YabaTech students about their experience with our platform.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Oluwaseun A.",
                department: "Mechanical Engineering",
                level: "300 Level",
                quote: "This platform has made accessing my course materials so much easier. I can study anywhere, anytime!"
              },
              {
                name: "Chioma N.",
                department: "Computer Science",
                level: "200 Level",
                quote: "The quality of the materials and the ease of use is impressive. It's a must-have for every YabaTech student."
              },
              {
                name: "Ibrahim M.",
                department: "Civil Engineering",
                level: "400 Level",
                quote: "Having all my textbooks in one place has improved my study routine significantly. Highly recommended!"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="bg-gray-800 p-6 rounded-lg"
              >
                <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.department}</p>
                  <p className="text-gray-400 text-sm">{testimonial.level}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="relative py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Fixed Background */}
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pawel-czerwinski-BAiRfbt1HRE-unsplash.jpg-1HzdmqIgkyrBsYtyt3WBXcxQSZVWMf.jpeg')`,
            zIndex: -1
          }}
        />

        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <Badge className="bg-yellow-300 text-gray-900 mb-4">Get Started Today</Badge>
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Learning Experience?</h2>
            <p className="text-gray-300 mb-10 text-lg">Join thousands of YabaTech students who are already enjoying easy access to their course materials.</p>
            <Link href="/catalog">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white">
                <Library className="mr-2" />
                Browse Catalog
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

