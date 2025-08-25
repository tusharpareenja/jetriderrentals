'use server'

import { addFormSubmissionToSheet } from '@/lib/googleSheets'

export interface BookingSubmission {
  name: string;
  phone: string;
  car: string;
  pickupFrom: string;
  pickupDate: string;
  dropDate: string;
  bookingType: 'car_booking';
}

export async function submitBooking(data: BookingSubmission) {
  try {
    // Basic validation
    if (!data.name || !data.phone || !data.car || !data.pickupFrom || !data.pickupDate || !data.dropDate) {
      return {
        success: false,
        message: 'Please fill in all required fields',
      }
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      return {
        success: false,
        message: 'Please enter a valid phone number',
      }
    }

    // Date validation
    const pickupDate = new Date(data.pickupDate)
    const dropDate = new Date(data.dropDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pickupDate < today) {
      return {
        success: false,
        message: 'Pickup date cannot be in the past',
      }
    }

    if (dropDate <= pickupDate) {
      return {
        success: false,
        message: 'Drop date must be after pickup date',
      }
    }

    // Convert booking data to the format expected by Google Sheets
    const formData = {
      name: data.name,
      car: data.car,
      phone: data.phone,
      email: '', // Not collected in booking form
      pickupDate: data.pickupDate,
      returnDate: data.dropDate,
      message: `Booking Type: Car Rental | Pickup From: ${data.pickupFrom} | Booking Type: ${data.bookingType}`
    }

    // Add to Google Sheets
    const result = await addFormSubmissionToSheet(formData)

    if (result.success) {
      return {
        success: true,
        message: 'Thank you! Your booking has been submitted successfully. We will contact you soon to confirm your reservation.',
      }
    } else {
      return {
        success: false,
        message: 'Sorry, there was an error submitting your booking. Please try again later.',
      }
    }
  } catch (error) {
    console.error('Error in booking submission:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    }
  }
}
