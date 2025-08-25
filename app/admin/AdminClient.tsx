/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Car, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  EyeOff,
  Upload,
  X,
  Image,
  Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { addCar } from "@/app/actions/carAdd"
import { getAllCars, updateCar, deleteCar } from "@/app/actions/carManagement"

// Admin credentials - use NEXT_PUBLIC_ env vars on client
const ADMIN_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD
}

// Sample car data for fallback
const initialCars = []

export default function AdminClient() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [cars, setCars] = useState<any[]>([])
  const [editingCar, setEditingCar] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingCar, setIsAddingCar] = useState(false)
  const [isUpdatingCar, setIsUpdatingCar] = useState(false)
  const [isDeletingCar, setIsDeletingCar] = useState<string | null>(null)
  const [newCar, setNewCar] = useState({
    name: "",
    type: "Hatchback",
    price: 0,
    mileage: "",
    seater: "5 Seater",
    transmission: "Manual",
    year: "2023",
    fuelType: "Petrol",
    engineCapacity: "",
    features: [],
    description: "",
    status: "Available",
    images: [] as string[],
    imageFiles: [] as File[],
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuthenticated", "true")
      window.location.reload()
    } else {
      alert(`Invalid credentials!`) // Debugging line
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuthenticated")
    setEmail("")
    setPassword("")
  }

  const handleImageUpload = (files: FileList, isEdit: boolean = false) => {
    const maxFiles = 5
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    
    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`)
      return
    }

    const validFiles = Array.from(files).filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image file`)
        return false
      }
      return true
    })

    const imageUrls = validFiles.map(file => URL.createObjectURL(file))

    if (isEdit && editingCar) {
      const updatedImages = [...editingCar.images, ...imageUrls].slice(0, maxFiles)
      setEditingCar({ ...editingCar, images: updatedImages })
    } else {
      const updatedImages = [...newCar.images, ...imageUrls].slice(0, maxFiles)
      const updatedImageFiles = [...newCar.imageFiles, ...validFiles].slice(0, maxFiles)
      setNewCar({ ...newCar, images: updatedImages, imageFiles: updatedImageFiles })
    }
  }

  const removeImage = (index: number, isEdit: boolean = false) => {
    if (isEdit && editingCar) {
      const updatedImages = editingCar.images.filter((_: any, i: number) => i !== index)
      setEditingCar({ ...editingCar, images: updatedImages })
    } else {
      const updatedImages = newCar.images.filter((_: any, i: number) => i !== index)
      const updatedImageFiles = newCar.imageFiles.filter((_: any, i: number) => i !== index)
      setNewCar({ ...newCar, images: updatedImages, imageFiles: updatedImageFiles })
    }
  }

  const handleAddCar = async () => {
    if (!newCar.name || !newCar.price || newCar.imageFiles.length === 0) {
      alert("Please fill all required fields and upload at least one image")
      return
    }

    setIsAddingCar(true)
    try {
      // Convert frontend data to backend format
      const carData = {
        name: newCar.name,
        type: newCar.type,
        transmission: newCar.transmission,
        seats: parseInt(newCar.seater.split(' ')[0]),
        fuelType: newCar.fuelType,
        perDayCharge: newCar.price,
        description: newCar.description,
        mileage: newCar.mileage ? parseInt(newCar.mileage.split(' ')[0]) : undefined,
        year: newCar.year ? parseInt(newCar.year) : undefined,
        color: newCar.engineCapacity, // Using engineCapacity field for color temporarily
        features: newCar.features,
      }

      // Convert File objects to base64 strings
      const photoFiles = await Promise.all(
        newCar.imageFiles.map(async (file: File) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: base64
          };
        })
      );

      const result = await addCar(carData, photoFiles)
      
      if (result.success) {
        alert("Car added successfully!")
        // Refresh cars list
        fetchCars()
        setNewCar({
          name: "",
          type: "Hatchback",
          price: 0,
          mileage: "",
          seater: "5 Seater",
          transmission: "Manual",
          year: "2023",
          fuelType: "Petrol",
          engineCapacity: "",
          features: [],
          description: "",
          status: "Available",
          images: [],
          imageFiles: [],
        })
        setIsAddDialogOpen(false)
      } else {
        alert(`Failed to add car: ${result.message}  ${process.env.DATABASE_URL}`) // Debugging line
      }
    } catch (error) {
      console.error('Error adding car:', error)
      alert("An error occurred while adding the car")
    } finally {
      setIsAddingCar(false)
    }
  }

  const fetchCars = async () => {
    setIsLoading(true)
    try {
      const result = await getAllCars()
      if (result.success && result.cars) {
        setCars(result.cars)
      } else {
        console.error('Failed to fetch cars:', result.message)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCar = async () => {
    if (!editingCar) return

    setIsUpdatingCar(true)
    try {
      const carData = {
        name: editingCar.name,
        type: editingCar.type,
        transmission: editingCar.transmission,
        seats: parseInt(editingCar.seater.split(' ')[0]),
        fuelType: editingCar.fuelType,
        perDayCharge: editingCar.price,
        description: editingCar.description,
        mileage: editingCar.mileage ? parseInt(editingCar.mileage.split(' ')[0]) : undefined,
        year: editingCar.year ? parseInt(editingCar.year) : undefined,
        color: editingCar.engineCapacity,
        features: editingCar.features || [],
        isAvailable: editingCar.status === "Available",
      }

      const result = await updateCar(editingCar.id, carData)
      
      if (result.success) {
        alert("Car updated successfully!")
        fetchCars()
        setEditingCar(null)
        setIsEditDialogOpen(false)
      } else {
        alert(`Failed to update car: ${result.message}`)
      }
    } catch (error) {
      console.error('Error updating car:', error)
      alert("An error occurred while updating the car")
    } finally {
      setIsUpdatingCar(false)
    }
  }

  const handleDeleteCar = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return

    setIsDeletingCar(id)
    try {
      const result = await deleteCar(id)
      if (result.success) {
        alert("Car deleted successfully!")
        fetchCars()
      } else {
        alert(`Failed to delete car: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting car:', error)
      alert("An error occurred while deleting the car")
    } finally {
      setIsDeletingCar(null)
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem("adminAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchCars()
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">Admin Login</CardTitle>
            <p className="text-muted-foreground">Enter your credentials to access the admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="admin@jetriderrentals.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-heading font-bold">Jet Rider Rentals - Admin Panel</h1>
              <p className="text-sm opacity-90">Manage your car fleet and bookings</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-primary-foreground bg-red border-primary-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cars</p>
                  <p className="text-2xl font-bold">{cars.length}</p>
                </div>
                <Car className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Cars</p>
                  <p className="text-2xl font-bold">{cars.filter(car => car.status === "Available").length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">
                    {(cars.reduce((acc, car) => acc + car.rating, 0) / cars.length).toFixed(1)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">₹{cars.reduce((acc, car) => acc + car.price, 0).toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cars Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cars Management</CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Add Car
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading cars...</span>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-8">
                <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No cars found. Add your first car to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">ID</th>
                      <th className="text-left p-4 font-medium">Car</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Price/Day</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Rating</th>
                      <th className="text-left p-4 font-medium">Photos</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">{car.id}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{car.name}</p>
                            <p className="text-sm text-muted-foreground">{car.year} • {car.fuelType}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{car.type}</Badge>
                        </td>
                        <td className="p-4">₹{car.price}</td>
                        <td className="p-4">
                          <Badge variant={car.status === "Available" ? "default" : "secondary"}>
                            {car.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <span>{car.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Image className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{car.images?.length || 0}/5</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCar(car)
                                setIsEditDialogOpen(true)
                              }}
                              disabled={isUpdatingCar}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCar(car.id)}
                              className="text-red-600 hover:text-red-700"
                              disabled={isDeletingCar === car.id}
                            >
                              {isDeletingCar === car.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Car Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Car</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Car Name</Label>
                <Input
                  id="name"
                  value={newCar.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCar({...newCar, name: e.target.value})}
                  placeholder="e.g., Maruti Swift"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={newCar.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewCar({...newCar, type: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Day (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newCar.price || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCar({...newCar, price: parseInt(e.target.value)})}
                  placeholder="2500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  value={newCar.mileage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCar({...newCar, mileage: e.target.value})}
                  placeholder="22 kmpl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seater">Seating Capacity</Label>
                <select
                  id="seater"
                  value={newCar.seater}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewCar({...newCar, seater: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="5 Seater">5 Seater</option>
                  <option value="7 Seater">7 Seater</option>
                  <option value="8 Seater">8 Seater</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <select
                  id="transmission"
                  value={newCar.transmission}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewCar({...newCar, transmission: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={newCar.year}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCar({...newCar, year: e.target.value})}
                  placeholder="2023"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <select
                  id="fuelType"
                  value={newCar.fuelType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewCar({...newCar, fuelType: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="engineCapacity">Engine Capacity</Label>
                <Input
                  id="engineCapacity"
                  value={newCar.engineCapacity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCar({...newCar, engineCapacity: e.target.value})}
                  placeholder="1.2L"
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={newCar.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCar({...newCar, description: e.target.value})}
                placeholder="Car description..."
                className="w-full p-2 border rounded-md h-20"
              />
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-4 mt-6">
              <Label>Car Photos (Max 5)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={newCar.imageFiles.length >= 5}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photos
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {newCar.imageFiles.length}/5 photos uploaded
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Preview */}
              {newCar.images.length > 0 && (
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {newCar.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Car photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isAddingCar}>
                Cancel
              </Button>
              <Button onClick={handleAddCar} disabled={isAddingCar}>
                {isAddingCar ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Car'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Dialog */}
      {isEditDialogOpen && editingCar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Car</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Car Name</Label>
                <Input
                  id="edit-name"
                  value={editingCar.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingCar({...editingCar, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <select
                  id="edit-type"
                  value={editingCar.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingCar({...editingCar, type: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="MUV">MUV</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price per Day (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingCar.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingCar({...editingCar, price: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  value={editingCar.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingCar({...editingCar, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mileage">Mileage</Label>
                <Input
                  id="edit-mileage"
                  value={editingCar.mileage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingCar({...editingCar, mileage: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-transmission">Transmission</Label>
                <select
                  id="edit-transmission"
                  value={editingCar.transmission}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingCar({...editingCar, transmission: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year</Label>
                <Input
                  id="edit-year"
                  value={editingCar.year}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingCar({...editingCar, year: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fuelType">Fuel Type</Label>
                <select
                  id="edit-fuelType"
                  value={editingCar.fuelType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingCar({...editingCar, fuelType: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-seater">Seating Capacity</Label>
                <select
                  id="edit-seater"
                  value={editingCar.seater}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingCar({...editingCar, seater: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="5 Seater">5 Seater</option>
                  <option value="7 Seater">7 Seater</option>
                  <option value="8 Seater">8 Seater</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-engineCapacity">Engine Capacity</Label>
                <Input
                  id="edit-engineCapacity"
                  value={editingCar.engineCapacity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingCar({...editingCar, engineCapacity: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rating">Rating</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={editingCar.rating}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingCar({...editingCar, rating: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-description">Description</Label>
              <textarea
                id="edit-description"
                value={editingCar?.description || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingCar({...editingCar, description: e.target.value})}
                className="w-full p-2 border rounded-md h-20"
              />
            </div>

            {/* Photo Upload Section for Edit */}
            <div className="space-y-4 mt-6">
              <Label>Car Photos (Max 5)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editFileInputRef.current?.click()}
                      disabled={editingCar.images?.length >= 5}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photos
                    </Button>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files, true)}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {editingCar.images?.length || 0}/5 photos uploaded
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Preview for Edit */}
              {editingCar.images?.length > 0 && (
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {editingCar.images.map((image: any, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Car photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index, true)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdatingCar}>
                Cancel
              </Button>
              <Button onClick={handleEditCar} disabled={isUpdatingCar}>
                {isUpdatingCar ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
