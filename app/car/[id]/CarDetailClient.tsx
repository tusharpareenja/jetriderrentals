"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Star,
  Fuel,
  Users,
  Zap,
  Calendar,
  Shield,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCarById } from "@/app/actions/carManagement"
import { submitForm } from "@/app/actions/formSubmission"
import OptimizedImage from "@/components/OptimizedImage"

// Car interface
interface Car {
  id: string;
  name: string;
  type: string;
  price: number;
  images?: string[];
  mileage: string;
  seater: string;
  transmission: string;
  rating: number;
  year: string;
  fuelType: string;
  engineCapacity: string;
  features: string[];
  description: string;
  priceBreakdown: {
    basePrice: number;
    insurance: number;
    taxes: number;
    total: number;
  };
}

export default function CarDetailClient({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [bookingDays, setBookingDays] = useState(1)
  
  // Booking form state
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    car: '',
    pickupDate: '',
    dropDate: '',
    pickupFrom: ''
  })
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })

  // Fetch car data from backend
  useEffect(() => {
      const fetchCar = async () => {
    try {
      setIsLoading(true)
      const result = await getCarById(params.id)
      if (result.success && result.car) {
        setCar(result.car)
        // Pre-fill car name in booking form
        setBookingForm(prev => ({ ...prev, car: result.car.name }))
      } else {
        console.error('Failed to fetch car:', result.message)
      }
    } catch (error) {
      console.error('Error fetching car:', error)
    } finally {
      setIsLoading(false)
    }
  }

  fetchCar()
}, [params.id])

// Booking form handlers
const handleBookingFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  setIsSubmitting(true)
  setSubmitStatus({ type: null, message: '' })
  
  try {
    // Submit booking to Google Sheets using existing form submission
    const result = await submitForm({
      name: bookingForm.name,
      car: bookingForm.car,
      phone: bookingForm.phone,
      email: '', // Not collected in booking form
      pickupDate: bookingForm.pickupDate,
      returnDate: bookingForm.dropDate,
      message: `Booking Type: Car Rental | Pickup From: ${bookingForm.pickupFrom}`
    })
    
    if (result.success) {
      setSubmitStatus({ 
        type: 'success', 
        message: 'Thank you! Your booking has been submitted successfully. We will contact you soon to confirm your reservation.' 
      })
      
      // Reset form after successful submission
      setTimeout(() => {
        setBookingForm({
          name: '',
          phone: '',
          car: car?.name || '',
          pickupDate: '',
          dropDate: '',
          pickupFrom: ''
        })
        setIsBookingFormOpen(false)
        setSubmitStatus({ type: null, message: '' })
      }, 3000)
    } else {
      setSubmitStatus({ 
        type: 'error', 
        message: result.message 
      })
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
  setBookingForm(prev => ({ ...prev, [field]: value }))
}

const openBookingForm = () => {
  setIsBookingFormOpen(true)
  setSubmitStatus({ type: null, message: '' })
}

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Loading car details...</span>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Car Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested car is not available.</p>
          <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const totalPrice = car.priceBreakdown.total * bookingDays

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${car.name} Rental`,
            description: car.description,
            image: car.images,
            brand: {
              "@type": "Brand",
              name: car.name.split(" ")[0],
            },
            model: car.name,
            vehicleConfiguration: car.type,
            vehicleTransmission: car.transmission,
            fuelType: car.fuelType,
            numberOfDoors: car.type === "Hatchback" ? 5 : 4,
            seatingCapacity: Number.parseInt(car.seater),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: car.rating,
              reviewCount: 50,
            },
            offers: {
              "@type": "Offer",
              price: car.price,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Jet Ride Rentals",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Sector 22",
                  addressLocality: "Chandigarh",
                  addressRegion: "Punjab",
                  postalCode: "160022",
                  addressCountry: "IN",
                },
                telephone: "+91 98765 43210",
                email: "info@jetriderrentals.com",
              },
            },
          }),
        }}
      />

      <nav className="sticky top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-heading font-bold text-primary">Jet Ride Rentals</h1>
                <span className="text-xs text-muted-foreground">Chandigarh</span>
              </div>
            </div>
            
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <OptimizedImage
                src={car.images && car.images.length > 0 ? car.images[selectedImageIndex] || "/placeholder.svg" : "/placeholder.svg"}
                alt={`${car.name} - Image ${selectedImageIndex + 1}`}
                width={600}
                height={384}
                className="w-full h-96 object-cover"
                priority={true}
              />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{car.type}</Badge>
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{car.rating}</span>
              </div>
            </div>

            {car.images && car.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-md transition-all duration-200 ${
                      selectedImageIndex === index ? "ring-2 ring-primary" : "hover:opacity-80"
                    }`}
                  >
                    <OptimizedImage
                      src={image || "/placeholder.svg"}
                      alt={`${car.name} thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-20 object-cover"
                      priority={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{car.name}</h1>
              <p className="text-muted-foreground mb-4">{car.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{car.year}</span>
                <span>•</span>
                <span>{car.fuelType}</span>
                <span>•</span>
                <span>{car.engineCapacity}</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Fuel className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{car.mileage}</p>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{car.seater}</p>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{car.transmission}</p>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{car.year}</p>
                      <p className="text-sm text-muted-foreground">Model Year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {car.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              {/* <CardHeader>
                <CardTitle className="text-xl">Price Breakdown</CardTitle>
              </CardHeader> */}
              <CardContent className="space-y-4">
                {/* <div className="flex justify-between items-center">
                  <span>Base Price (per day)</span>
                  <span className="font-medium">₹{car.priceBreakdown.basePrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Insurance</span>
                  <span className="font-medium">₹{car.priceBreakdown.insurance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxes & Fees</span>
                  <span className="font-medium">₹{car.priceBreakdown.taxes}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total per day</span>
                  <span className="text-primary">₹{car.priceBreakdown.total}</span>
                </div> */}

                <div className="mt-6 p-4 bg-card rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-medium">Number of days:</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setBookingDays(Math.max(1, bookingDays - 1))}>
                        -
                      </Button>
                      <span className="w-12 text-center font-medium">{bookingDays}</span>
                      <Button variant="outline" size="sm" onClick={() => setBookingDays(bookingDays + 1)}>
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary">₹{car.price*bookingDays}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Book This Car</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">₹{car.price}</div>
                  <div className="text-sm text-muted-foreground">per day</div>
                </div>

                <Button 
                  onClick={openBookingForm}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                >
                  Book Now - ₹{car.price*bookingDays}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure booking</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Instant confirmation</span>
                  </div>
                </div>

                <hr className="border-border" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>+91 90901 51546</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>info@jetriderrentals.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Chandigarh, India</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {isBookingFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Book Your Car</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookingFormOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              {/* Status Message */}
              {submitStatus.type && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 text-red-600">⚠</div>
                  )}
                  <span className="text-sm font-medium">{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleBookingFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    placeholder="Your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Car</label>
                  <input
                    type="text"
                    value={bookingForm.car}
                    onChange={(e) => handleInputChange('car', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    placeholder="Car name"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Pickup From *</label>
                  <input
                    type="text"
                    value={bookingForm.pickupFrom}
                    onChange={(e) => handleInputChange('pickupFrom', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    placeholder="Pickup location (e.g., Chandigarh Airport, Hotel, etc.)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Pickup Date *</label>
                  <input
                    type="date"
                    value={bookingForm.pickupDate}
                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Drop Date *</label>
                  <input
                    type="date"
                    value={bookingForm.dropDate}
                    onChange={(e) => handleInputChange('dropDate', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsBookingFormOpen(false)}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Booking'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
