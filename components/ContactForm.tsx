"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useSendEmail from "@/lib/hooks/email"
// import { submitToGoogleSheets } from '@/app/actions/googleSheets'
// import { FormSubmission } from '@/lib/googleSheets'

interface ContactFormProps {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
  className?: string
}

export default function ContactForm({ onSuccess, onError, className = "" }: ContactFormProps) {
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
  const { sendEmail, loading } = useSendEmail()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.phone) {
      onError?.('Please fill in all required fields (Name, Phone)')
      return
    }

    // Email validation (optional field)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        onError?.('Please enter a valid email address')
        return
      }
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      onError?.('Please enter a valid phone number')
      return
    }

    setIsSubmitting(true)

    try {
      // Add to Google Sheets - commented out for now
      // const result = await submitToGoogleSheets(formData)

      // if (result.success) {
        // Send email notification
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Submission - Jet Ride Rentals</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
            <p><strong>Car:</strong> ${formData.car || 'Not specified'}</p>
            <p><strong>Pickup Date:</strong> ${formData.pickupDate || 'Not specified'}</p>
            <p><strong>Return Date:</strong> ${formData.returnDate || 'Not specified'}</p>
            <p><strong>Message:</strong><br/>${formData.message || 'No additional message'}</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">This email was sent from your Jet ride rental website contact form.</p>
          </div>
        `

        const emailResult = await sendEmail({
          to: 'tusharpareenja@gmail.com',
          subject: 'New Contact Submission - Jet Ride Rentals',
          html: emailHtml,
          text: `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || '-'}\nCar: ${formData.car || '-'}\nPickup: ${formData.pickupDate || '-'}\nReturn: ${formData.returnDate || '-'}\nMessage: ${formData.message || '-'}`,
        })

        if (emailResult.success) {
          onSuccess?.('Thank you! Your inquiry has been submitted successfully. We will contact you soon.')
          
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
          onError?.(emailResult.message)
        }
      // } else {
      //   onError?.('Sorry, there was an error submitting your inquiry. Please try again later.')
      // }
    } catch (error) {
      console.error('Error in form submission:', error)
      onError?.('An unexpected error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
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
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Your phone number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <Label htmlFor="car">Car Interest</Label>
          <Input
            id="car"
            type="text"
            value={formData.car}
            onChange={(e) => handleInputChange('car', e.target.value)}
            placeholder="Car model you're interested in"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickupDate">Pickup Date</Label>
          <Input
            id="pickupDate"
            type="date"
            value={formData.pickupDate}
            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="returnDate">Return Date</Label>
          <Input
            id="returnDate"
            type="date"
            value={formData.returnDate}
            onChange={(e) => handleInputChange('returnDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Tell us about your requirements..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || loading}
        className="w-full"
      >
        {isSubmitting || loading ? 'Submitting...' : 'Submit Inquiry'}
      </Button>
    </form>
  )
}
