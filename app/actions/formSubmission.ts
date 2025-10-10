'use server'

import { addFormSubmissionToSheet, FormSubmission } from '@/lib/googleSheets'
import { sendEmailSimple } from '@/lib/sendEmailSimple'

export async function submitForm(data: FormSubmission) {
  try {
    // Basic validation
    if (!data.name || !data.phone) {
      return {
        success: false,
        message: 'Please fill in all required fields (Name, Email, Phone)',
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      // return {
      //   success: false,
      //   message: 'Please enter a valid email address',
      // }
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      return {
        success: false,
        message: 'Please enter a valid phone number',
      }
    }

    // Add to Google Sheets
    const result = await addFormSubmissionToSheet(data)

    if (result.success) {
      // Fire-and-forget email notification; do not block success on email failure
      const emailHtml = `
        <div>
          <h2>New Contact Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Email:</strong> ${data.email || '-'} </p>
          <p><strong>Car:</strong> ${data.car || '-'} </p>
          <p><strong>Pickup Date:</strong> ${data.pickupDate || '-'} </p>
          <p><strong>Return Date:</strong> ${data.returnDate || '-'} </p>
          <p><strong>Message:</strong><br/>${data.message || '-'} </p>
        </div>
      `
      
      // Enhanced logging for production debugging
      console.log('Attempting to send email for submission:', {
        name: data.name,
        phone: data.phone,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
      });
      
      // best-effort send; log any errors
      sendEmailSimple({
        to: 'mayanksharmarrk30@gmail.com',
        subject: 'New Contact Submission - Rudra Car Rentals',
        html: emailHtml,
        text: `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || '-'}\nCar: ${data.car || '-'}\nPickup: ${data.pickupDate || '-'}\nReturn: ${data.returnDate || '-'}\nMessage: ${data.message || '-'}`,
      }).then(() => {
        console.log('Email sent successfully for:', data.name);
      }).catch((err) => {
        console.error('Failed to send contact email:', {
          error: err.message,
          code: err.code,
          response: err.response,
          name: data.name,
          timestamp: new Date().toISOString()
        });
      })

      return {
        success: true,
        message: 'Thank you! Your inquiry has been submitted successfully. We will contact you soon.',
      }
    } else {
      return {
        success: false,
        message: 'Sorry, there was an error submitting your inquiry. Please try again later.',
      }
    }
  } catch (error) {
    console.error('Error in form submission:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    }
  }
}
