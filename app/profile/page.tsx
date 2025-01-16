'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { User, Book, Clock, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Mock user data
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  department: 'Computer Science',
  level: '300',
  joinedDate: 'September 2021',
}

const purchaseHistory = [
  { id: 1, title: 'Introduction to Programming', date: '2023-05-15', price: 49.99 },
  { id: 2, title: 'Data Structures and Algorithms', date: '2023-06-02', price: 59.99 },
  { id: 3, title: 'Database Management Systems', date: '2023-07-10', price: 54.99 },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically update the user data in the backend
    console.log('Updated user data:', editedUser)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 pt-32">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-purple-600 text-white mb-4">User Profile</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome, {user.name}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your account details and view your purchase history.
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Personal Information</span>
                  <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedUser.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={editedUser.department}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Level</Label>
                      <Input
                        id="level"
                        name="level"
                        value={editedUser.level}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Joined Date</Label>
                      <Input value={editedUser.joinedDate} disabled />
                    </div>
                  </div>
                  {isEditing && (
                    <Button type="submit" className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                      Save Changes
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="purchases">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h3 className="font-semibold">{purchase.title}</h3>
                        <p className="text-sm text-gray-600">{purchase.date}</p>
                      </div>
                      <span className="font-bold">₦{purchase.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

