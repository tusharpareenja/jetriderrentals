"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Settings,
  Calendar,
  Fuel,
  Users,
  Zap,
  Star,
  Filter,
  Phone,
  Mail,
  Clock,
  Quote,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllCars } from "@/app/actions/carManagement"
import { submitForm } from "@/app/actions/formSubmission"
import OptimizedImage from "@/components/OptimizedImage"

// Car data interface
interface Car {
  id: string;
  name: string;
  type: string;
  price: number;
  image?: string;
  mileage: string;
  seater: string;
  transmission: string;
  rating: number;
  images?: string[];
}

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Chandigarh",
    rating: 5,
    comment:
              "Excellent service! The car was in perfect condition and the booking process was seamless. Highly recommend Jet Rider Rentals for anyone visiting Chandigarh.",
    car: "Honda City",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    comment:
              "Amazing experience with Jet Rider Rentals. The staff was very professional and the car was delivered on time. Will definitely book again!",
    car: "Hyundai Creta",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Amit Singh",
    location: "Mumbai",
    rating: 4,
    comment:
      "Great value for money. The Swift was fuel efficient and perfect for city driving. Customer service was responsive and helpful throughout.",
    car: "Maruti Swift",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Neha Gupta",
    location: "Bangalore",
    rating: 5,
    comment:
              "Outstanding service! The car was spotless and well-maintained. The team at Jet Rider Rentals made our Chandigarh trip memorable.",
    car: "Toyota Innova",
    date: "1 week ago",
  },
  {
    id: 5,
    name: "Vikram Mehta",
    location: "Pune",
    rating: 4,
    comment:
      "Professional service with competitive pricing. The booking was hassle-free and the car exceeded our expectations. Recommended!",
    car: "Kia Seltos",
    date: "2 months ago",
  },
  {
    id: 6,
    name: "Sunita Patel",
    location: "Ahmedabad",
    rating: 5,
    comment:
      "Fantastic experience! The team was courteous and the car was delivered exactly as promised. Will be our go-to rental service in Chandigarh.",
    car: "Honda Amaze",
    date: "3 weeks ago",
  },
]

function CarCard({ car }: { car: Car }) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleViewDetails = () => {
    router.push(`/car/${car.id}`)
  }

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/car/${car.id}`)
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg"}
          alt={car.name}
          width={400}
          height={192}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          priority={false}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>{car.mileage}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{car.seater}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{car.transmission}</span>
            </div>
          </div>
        </div>
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{car.type}</Badge>
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{car.rating}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-semibold text-lg text-foreground">{car.name}</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">₹{car.price}</p>
            <p className="text-sm text-muted-foreground">per day</p>
          </div>
        </div>
        <Button onClick={handleBookNow} className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground">
          Book Now
        </Button>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Quote className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-heading font-semibold text-foreground">{testimonial.name}</h4>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{testimonial.location}</span>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mb-4 leading-relaxed">{testimonial.comment}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Rented: {testimonial.car}</span>
          <span>{testimonial.date}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAllCars, setShowAllCars] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    car: '',
    phone: '',
    email: '',
    pickupDate: '',
    returnDate: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })

  const filterTypes = ["All", "Hatchback", "Sedan", "SUV", "Luxury"]

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true)
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

    fetchCars()
  }, [])

  const filteredCars = activeFilter === "All" ? cars : cars.filter((car) => car.type === activeFilter)

  const displayedCars = showAllCars ? filteredCars : filteredCars.slice(0, 12)

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })
    
    try {
      const result = await submitForm(formData)
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message })
        // Reset form
        setFormData({
          name: '',
          car: '',
          phone: '',
          email: '',
          pickupDate: '',
          returnDate: '',
          message: ''
        })
      } else {
        setSubmitStatus({ type: 'error', message: result.message })
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-heading font-bold text-primary">Jet Rider Rentals</h1>

            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#cars" className="text-foreground hover:text-primary transition-colors">
                Cars
              </a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
                Reviews
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Button className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground">
                Book Now
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#home"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#cars"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cars
                </a>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reviews
                </a>
                <a
                  href="#contact"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <div className="px-3 py-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Book Now</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.RxaZxkkX5ZtAy9ntYSMLcQHaEo?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Luxury car in Chandigarh"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 animate-fade-in-up">
            Premium Car Rentals
            <span className="block text-primary">in Chandigarh</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-up animation-delay-200">
            Experience luxury and comfort with our wide selection of premium vehicles. From sedans to SUVs, find your
            perfect ride today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Button
              onClick={() => window.location.href = '#cars'}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Rent Now
            </Button>
            <Button
              onClick={() => window.location.href = '#cars'}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
            >
              View Cars
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Why Choose Jet Rider Rentals?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide exceptional service and premium vehicles to make your journey memorable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">Easy Booking</h3>
                <p className="text-muted-foreground">
                  Book your car in just a few clicks with our simple and intuitive booking system
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">Well Maintained</h3>
                <p className="text-muted-foreground">
                  All our vehicles are regularly serviced and maintained to ensure your safety and comfort
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">Local Expertise</h3>
                <p className="text-muted-foreground">
                  Based in Chandigarh, we know the city and surrounding areas like the back of our hand
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section id="cars" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Our Premium Fleet</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide selection of well-maintained vehicles perfect for every occasion
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter by type:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {filterTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => {
                    setActiveFilter(type)
                    setShowAllCars(false) // Reset show all when filtering
                  }}
                  variant={activeFilter === type ? "default" : "outline"}
                  className={`transition-all duration-300 ${
                    activeFilter === type
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {type}
                  {type !== "All" && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {cars.filter((car) => car.type === type).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {!isLoading && (
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Showing {displayedCars.length} of {filteredCars.length}{" "}
                {activeFilter === "All" ? "cars" : activeFilter.toLowerCase() + "s"}
              </p>
            </div>
          )}

          {/* Car Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-lg text-muted-foreground">Loading cars...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {displayedCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          {!isLoading && !showAllCars && filteredCars.length > 12 && (
            <div className="text-center">
              <Button
                onClick={() => setShowAllCars(true)}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                See More {activeFilter === "All" ? "Cars" : activeFilter + "s"} ({filteredCars.length - 12} more)
              </Button>
            </div>
          )}

          {!isLoading && filteredCars.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-6">
                No cars are currently available. Please check back later.
              </p>
            </div>
          )}

          {!isLoading && cars.length > 0 && filteredCars.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-6">
                No {activeFilter.toLowerCase()}s are currently available. Try selecting a different category.
              </p>
              <Button
                onClick={() => setActiveFilter("All")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                View All Cars
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.8/5</span>
                <span>Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">500+</span>
                <span>Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to book your perfect ride? Contact us today and let us help you plan your journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Call Us</h3>
                    <p className="text-muted-foreground mb-2">Speak directly with our team</p>
                    <p className="text-foreground font-medium">+91 98765 43210</p>
                    <p className="text-foreground font-medium">+91 87654 32109</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Email Us</h3>
                    <p className="text-muted-foreground mb-2">Send us your queries</p>
                                  <p className="text-foreground font-medium">info@jetriderrentals.com</p>
              <p className="text-foreground font-medium">bookings@jetriderrentals.com</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Visit Us</h3>
                    <p className="text-muted-foreground mb-2">Our office location</p>
                    <p className="text-foreground font-medium">
                      Sector 22, Chandigarh
                      <br />
                      Punjab 160022, India
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Business Hours</h3>
                    <p className="text-muted-foreground mb-2">We&apos;re here to help</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-foreground">
                        <span className="font-medium">Mon - Sat:</span> 9:00 AM - 8:00 PM
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium">Sunday:</span> 10:00 AM - 6:00 PM
                      </p>
                      <p className="text-primary font-medium">24/7 Emergency Support</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Contact Form */}
            <div>
              <Card className="p-8">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-6">Quick Inquiry</h3>
                
                {/* Status Message */}
                {submitStatus.type && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {submitStatus.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">{submitStatus.message}</span>
                  </div>
                )}
                
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Car</label>
                      <input
                        type="text"
                        value={formData.car}
                        onChange={(e) => handleInputChange('car', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                        placeholder="Car Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="Your email address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Pickup Date</label>
                      <input
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Return Date</label>
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background resize-none"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Inquiry'
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-4">
                  <h3 className="text-2xl font-heading font-bold text-primary">Jet Rider Rentals</h3>
                  <span className="ml-2 text-sm text-muted-foreground">Chandigarh</span>
                </div>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Your trusted partner for premium car rentals in Chandigarh. We provide well-maintained vehicles and
                  exceptional service to make your journey comfortable and memorable.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#home" className="text-muted-foreground hover:text-primary transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#cars" className="text-muted-foreground hover:text-primary transition-colors">
                      Our Fleet
                    </a>
                  </li>
                  <li>
                    <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                      Reviews
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      About Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-4">Services</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Hatchback Rental
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Sedan Rental
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      SUV Rental
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Luxury Rental
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Airport Transfer
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="py-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Call Us</p>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email Us</p>
                  <p className="text-sm text-muted-foreground">info@jetriderrentals.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">Sector 22, Chandigarh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                <p>&copy; 2025 Jet Rider Rentals. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cancellation Policy
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <span className="text-primary">❤</span>
                <span>in Chandigarh</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
