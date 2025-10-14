"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useSendEmail from "@/lib/hooks/email"
// import { submitToGoogleSheets } from '@/app/actions/googleSheets'
// import { FormSubmission } from '@/lib/googleSheets'

interface BookingFormProps {
  carName: string
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
  onClose?: () => void
  className?: string
}

export default function BookingForm({ 
  carName, 
  onSuccess, 
  onError, 
  onClose, 
  className = "" 
}: BookingFormProps) {
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    pickupDate: '',
    dropDate: '',
    pickupFrom: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sendEmail, loading } = useSendEmail()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!bookingForm.name || !bookingForm.phone) {
      onError?.('Please fill in all required fields (Name, Phone)')
      return
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(bookingForm.phone.replace(/\s/g, ''))) {
      onError?.('Please enter a valid phone number')
      return
    }

    setIsSubmitting(true)

    try {
      // Submit booking to Google Sheets - commented out for now
      // const formData: FormSubmission = {
      //   name: bookingForm.name,
      //   car: bookingForm.car || carName,
      //   phone: bookingForm.phone,
      //   email: '', // Not collected in booking form
      //   pickupDate: bookingForm.pickupDate,
      //   returnDate: bookingForm.dropDate,
      //   message: `Booking Type: Car Rental | Pickup From: ${bookingForm.pickupFrom}`
      // }

      // const result = await addFormSubmissionToSheet(formData)

      // if (result.success) {
        // Send email notification
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Car Booking - Jet Ride Rentals</h2>
            <p><strong>Name:</strong> ${bookingForm.name}</p>
            <p><strong>Phone:</strong> ${bookingForm.phone}</p>
            <p><strong>Car:</strong> ${carName}</p>
            <p><strong>Pickup Date:</strong> ${bookingForm.pickupDate || 'Not specified'}</p>
            <p><strong>Return Date:</strong> ${bookingForm.dropDate || 'Not specified'}</p>
            <p><strong>Pickup From:</strong> ${bookingForm.pickupFrom || 'Not specified'}</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">This booking was submitted from your Jet ride rental website.</p>
          </div>
        `

        const emailResult = await sendEmail({
          to: 'tusharpareenja@gmail.com',
          subject: 'New Car Booking - Jet Ride Rentals',
          html: emailHtml,
          text: `Name: ${bookingForm.name}\nPhone: ${bookingForm.phone}\nCar: ${carName}\nPickup Date: ${bookingForm.pickupDate || '-'}\nReturn Date: ${bookingForm.dropDate || '-'}\nPickup From: ${bookingForm.pickupFrom || '-'}`,
        })

        if (emailResult.success) {
          onSuccess?.('Thank you! Your booking has been submitted successfully. We will contact you soon to confirm your reservation.')
          
          // Reset form
          setBookingForm({
            name: '',
            phone: '',
            pickupDate: '',
            dropDate: '',
            pickupFrom: ''
          })
          
          // Close form after success
          setTimeout(() => {
            onClose?.()
          }, 3000)
        } else {
          onError?.(emailResult.message)
        }
      // } else {
      //   onError?.('Sorry, there was an error submitting your booking. Please try again later.')
      // }
    } catch (error) {
      console.error('Error in booking submission:', error)
      onError?.('An unexpected error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            value={bookingForm.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={bookingForm.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Your phone number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickupDate">Pickup Date</Label>
          <Input
            id="pickupDate"
            type="date"
            value={bookingForm.pickupDate}
            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="dropDate">Return Date</Label>
          <Input
            id="dropDate"
            type="date"
            value={bookingForm.dropDate}
            onChange={(e) => handleInputChange('dropDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="pickupFrom">Pickup Location</Label>
        <Input
          id="pickupFrom"
          type="text"
          value={bookingForm.pickupFrom}
          onChange={(e) => handleInputChange('pickupFrom', e.target.value)}
          placeholder="Where would you like to pickup the car?"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || loading}
        className="w-full"
      >
        {isSubmitting || loading ? 'Submitting Booking...' : 'Book Now'}
      </Button>
    </form>
  )
}
