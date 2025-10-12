"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Fuel,
  Users,
  Zap,
  Star,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  CreditCard,
  FileText,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

// Travel images for hero carousel
const travelImages = [
  "/travel-image1.jpg",
  "/travel-image2.webp", 
  "/travel-image3.webp",
  "/travel-image4.webp"
]

// NRI-specific car data with weekly and monthly pricing
const nriCars = [
  {
    id: 1,
    name: "Swift",
    type: "Hatchback",
    weeklyPrice: 12600,
    monthlyPrice: 45000,
    image: "/swift.webp",
    mileage: "22 kmpl",
    seater: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.5,
    features: ["AC", "Power Steering", "Music System", "Central Locking"],
  },
   {
    id: 11,
    name: "i20",
    type: "Hatchback",
    weeklyPrice: 14000,
    monthlyPrice: 50000,
    image: "/i20.jpg",
    mileage: "22 kmpl",
    seater: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.5,
    features: ["AC", "Power Steering", "Music System", "Central Locking"],
  },
  {
    id: 2,
    name: "Altroz",
    type: "Hatchback",
    weeklyPrice: 14000,
    monthlyPrice: 50000,
    image: "/altroz.jpg",
    mileage: "18 kmpl",
    seater: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.6,
    features: ["AC", "Power Steering", "Touchscreen", "Reverse Camera"],
  },
  {
    id: 3,
    name: "Hyundai Venue",
    type: "SUV",
    weeklyPrice: 15400,
    monthlyPrice: 55000,
    image: "/venue.png",
    mileage: "18 kmpl",
    seater: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.7,
    features: ["AC", "Sunroof", "Touchscreen", "Wireless Charging"],
  },
  {
    id: 4,
    name: "Scorpio N",
    type: "SUV",
    weeklyPrice: 35000,
    monthlyPrice: 120000,
    image: "/scorpioN.jpg",
    mileage: "15 kmpl",
    seater: "7 Seater",
    transmission: "Automatic",
    fuel: "Diesel",
    rating: 4.6,
    features: ["AC", "Power Steering", "Touchscreen", "Reverse Camera"],
  },
  {
    id: 5,
    name: "Hyundai Creta",
    type: "SUV",
    weeklyPrice: 22400,
    monthlyPrice: 75000,
    image: "/creta.jpg",
    mileage: "18 kmpl",
    seater: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.7,
    features: ["AC", "Sunroof", "Touchscreen", "Wireless Charging"],
  },
  {
    id: 6,
    name: "Mahindra Thar",
    type: "SUV",
    weeklyPrice: 28000,
    monthlyPrice: 90000,
    image: "/thar.jpg",
    mileage: "15 kmpl",
    seater: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.6,
    features: ["AC", "Power Steering", "Touchscreen", "Reverse Camera"],
  },
  {
    id: 7,
    name: "Scorpio S11",
    type: "SUV",
    weeklyPrice: 28000,
    monthlyPrice: 90000,
    image: "/scorpio.jpg",
    mileage: "18 kmpl",
    seater: "7 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    rating: 4.7,
    features: ["AC", "Sunroof", "Touchscreen", "Wireless Charging"],
  },
  {
    id: 8,
    name: "Hyundai Verna",
    type: "Sedan",
    weeklyPrice: 22400,
    monthlyPrice: 75000,
    image: "/verna.jpg",
    mileage: "20 kmpl",
    seater: "5 Seater",
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.6,
    features: ["AC", "Power Steering", "Touchscreen", "Reverse Camera"],
  },
  {
    id: 9,
    name: "Audi A3",
    type: "Luxury",
    weeklyPrice: 70000,
    monthlyPrice: 210000,
    image: "/audi.webp",
    mileage: "20 kmpl",
    seater: "5 Seater",
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.7,
    features: ["AC", "Sunroof", "Touchscreen", "Wireless Charging"],
  },
  {
    id: 10,
    name: "Fortuner",
    type: "SUV",
    weeklyPrice: 50000,
    monthlyPrice: 180000,
    image: "/fortuner.png",
    mileage: "13 kmpl",
    seater: "7 Seater",
    transmission: "Automatic",
    fuel: "Petrol",
    rating: 4.7,
    features: ["AC", "Sunroof", "Touchscreen", "Wireless Charging"],
  }
]

// Required documents data
const requiredDocuments = [
  {
    id: 1,
    icon: Globe,
    title: "Copy of Passport with valid visa.",
    description: "Valid passport with current visa documentation required for verification",
  },
  {
    id: 2,
    icon: FileText,
    title: "Driving license valid in India or any Indian license who will drive the car.",
    description: "International driving permit or valid Indian driving license for the designated driver",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Rs.5000 advance booking amount and balance amount will be charged at the time of delivery of vehicle.",
    description: "Advance payment required to confirm booking, remaining balance due at vehicle delivery"
  }
]

const NRICarCard = React.memo(function NRICarCard({ car, priceType }: { car: (typeof nriCars)[0]; priceType: "weekly" | "monthly" }) {
  const [isHovered, setIsHovered] = useState(false)

  const price = priceType === "weekly" ? car.weeklyPrice : car.monthlyPrice
  const priceLabel = priceType === "weekly" ? "Week" : "Month"

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    const message = `Hi! I'm interested in booking the ${car.name} for ${priceType === 'weekly' ? 'weekly' : 'monthly'} rental. Please provide more details.`
    const whatsappUrl = `https://wa.me/919090151546?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Main Image Container */}
        <div className="relative w-full h-48">
          <img
            src={car.image || "/placeholder.svg"}
            alt={car.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        </div>

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
        
        {/* Hover Information */}
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

        {/* Additional Info Divs */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-primary text-primary-foreground">{car.type}</Badge>
          
        </div>
        
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{car.rating}</span>
        </div>

      </div>
      <CardContent className="p-6 text-center">
        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">{car.name}</h3>
        <div className="mb-4">
          <p className="text-3xl font-bold text-foreground">
            ₹{price.toLocaleString()} / {priceLabel}
          </p>
        </div>
        <Button
          onClick={handleBookNow}
          className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-semibold py-3 rounded-lg"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  )
})

function DocumentCard({ document }: { document: (typeof requiredDocuments)[0] }) {
  const IconComponent = document.icon

  return (
    <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white">
      <CardContent className="pt-6">
        <div className="w-20 h-20 bg-[#8B4513] rounded-lg flex items-center justify-center mx-auto mb-6">
          <IconComponent className="w-10 h-10 text-white" />
        </div>
        <h3 className="font-heading font-semibold text-lg mb-4 text-foreground leading-relaxed">{document.title}</h3>
      </CardContent>
    </Card>
  )
}

export default function NRIPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in your NRI car rental services. Please provide more information."
    const whatsappUrl = `https://wa.me/919090151546?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Hero carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % travelImages.length
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Sort cars by price for weekly and monthly sections
  const weeklyCarsSorted = [...nriCars].sort((a, b) => a.weeklyPrice - b.weeklyPrice)
  const monthlyCarsSorted = [...nriCars].sort((a, b) => a.monthlyPrice - b.monthlyPrice)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/jet_rentals.png" alt="Jet Ride Rentals" className="w-12 h-12 mr-2" />
              <h1 className="text-2xl font-heading font-bold text-primary">Jet Ride Rentals</h1>

            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/#cars" className="text-foreground hover:text-primary transition-colors">
                Cars
              </Link>
              <Link href="/#testimonials" className="text-foreground hover:text-primary transition-colors">
                Reviews
              </Link>
              <Link href="/for-nri" className="text-foreground hover:text-primary transition-colors">
                For NRI
              </Link>
              <Link href="/#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
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
                <Link
                  href="/"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/#cars"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cars
                </Link>
                <Link
                  href="/#testimonials"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reviews
                </Link>
                <Link
                  href="/for-nri"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For NRI
                </Link>
                <Link
                  href="/#contact"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="px-3 py-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Book Now</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel with Gradient Overlay */}
        <div className="absolute inset-0">
          {travelImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Travel destinations for NRI"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 animate-fade-in-up">
            Premium Car Rentals
            <span className="block text-primary">for NRIs in TryCity</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-up animation-delay-200 max-w-4xl mx-auto leading-relaxed">
            Experience hassle-free mobility with our exclusive NRI car rental packages. Choose from weekly and monthly
            options with well-maintained vehicles, competitive rates, and simplified documentation process.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              View NRI Packages
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
            >
              Contact Us
            </Button>
          </div> */}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Weekly Car Rental Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="text-[#FF4500]">Weekly Car Rental For NRI&apos;s In TryCity</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              <span className="font-semibold text-foreground">
                Easy & Quick Online Booking. Well Maintained Fleet Available.
              </span>
            </p>
            <p className="text-lg text-muted-foreground max-w-6xl mx-auto mt-4 leading-relaxed">
              Enjoy the convenience and flexibility of our weekly rental packages tailored specifically for NRIs.
              Whether you&apos;re visiting family, on a business trip, or exploring the region, our diverse fleet of vehicles
              ensures you have the perfect car for your needs. With competitive rates, easy booking, and exceptional
              customer service, our weekly rentals provide a hassle-free and cost-effective solution for your stay.
              Travel with confidence and comfort, knowing you have reliable transportation at your fingertips.
            </p>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto mt-4 font-medium">
              Travel For Business or Leisure – get spoilt for choices with our Exhaustive Range of Well-Maintained Fleet
              of Hatchbacks, Sedan, SUVs, and Mini SUVs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {weeklyCarsSorted.map((car, index) => (
              <NRICarCard key={`weekly-${car.id}-${index}`} car={car} priceType="weekly" />
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Car Rental Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="text-[#FF4500]">Monthly Car Rental For NRI&apos;s In TryCity</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              <span className="font-semibold text-foreground">
                Easy & Quick Online Booking. Well Maintained Fleet Available.
              </span>
            </p>
            <p className="text-lg text-muted-foreground max-w-6xl mx-auto mt-4 leading-relaxed">
              Experience effortless mobility with our monthly rental options designed for NRIs. Choose from a range of
              well-maintained vehicles, including <span className="font-semibold">Hatchbacks</span>, Sedans, SUVs, and
              Mini SUVs, all available at competitive rates. Whether for extended business stays or leisurely visits,
              our flexible terms and excellent customer service ensure a seamless and enjoyable driving experience in
              TryCity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {monthlyCarsSorted.map((car, index) => (
              <NRICarCard key={`monthly-${car.id}-${index}`} car={car} priceType="monthly" />
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-8">Required Documents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {requiredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>

          {/* Additional Information */}
          <div className="bg-card rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                Important Information for NRI Customers
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Flexible Documentation</h4>
                    <p className="text-muted-foreground text-sm">
                      We accept international driving permits and assist with documentation process
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">24/7 Support</h4>
                    <p className="text-muted-foreground text-sm">
                      Round-the-clock customer support for all your travel needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Airport Pickup/Drop</h4>
                    <p className="text-muted-foreground text-sm">
                      Convenient airport transfer services available on request
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Competitive Rates</h4>
                    <p className="text-muted-foreground text-sm">
                      Special pricing packages designed specifically for NRI customers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Well-Maintained Fleet</h4>
                    <p className="text-muted-foreground text-sm">
                      Regular servicing and maintenance ensures safe and comfortable rides
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Easy Online Booking</h4>
                    <p className="text-muted-foreground text-sm">
                      Simple booking process with instant confirmation and payment options
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold">
                Book Your NRI Package Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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
                  <h3 className="text-2xl font-heading font-bold text-primary">Jet Ride Rentals</h3>
                  <span className="ml-2 text-sm text-muted-foreground">TryCity</span>
                </div>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Your trusted partner for premium car rentals in TryCity. We provide well-maintained vehicles and
                  exceptional service to make your journey comfortable and memorable.
                </p>
                <div className="flex items-center space-x-3">
                  <a
                    href="https://www.instagram.com/jet_ride_rentals?igsh=bXl2YXQ4Z3o3Zm9y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <span className="text-sm text-muted-foreground">Follow us on Instagram</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/#cars" className="text-muted-foreground hover:text-primary transition-colors">
                      Our Fleet
                    </Link>
                  </li>
                  <li>
                    <Link href="/nri" className="text-muted-foreground hover:text-primary transition-colors">
                      NRI Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                      Reviews
                    </Link>
                  </li>
                  <li>
                    <Link href="/#contact" className="text-muted-foreground hover:text-primary transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-4">NRI Services</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Weekly Rentals
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Monthly Rentals
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Airport Transfer
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      Documentation Help
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      24/7 Support
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
                  <p className="text-sm text-muted-foreground">+91 90901 51546</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email Us</p>
                  <p className="text-sm text-muted-foreground">jetriderentals@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">Cabin No. 4, SCO-210, Sector 14, Panchkula</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                <p>&copy; 2025 Jet Ride Rentals. All rights reserved.</p>
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
                    NRI Policy
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <span className="text-primary">❤</span>
                <span>for NRIs in TryCity</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button (bottom right) */}
      <div className="fixed right-4 bottom-4 z-50">
        <button
          onClick={handleWhatsAppClick}
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-110 focus:outline-none"
          aria-label="Chat on WhatsApp"
        >
          <img src="/whatsapp.png" alt="WhatsApp" className="w-14 h-14 object-contain" />
        </button>
      </div>
    </div>
  )
}
