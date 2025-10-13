import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, text } = body

    console.log('API Route: Attempting to send email via Gmail App Password:', {
      to: to,
      subject: subject,
      timestamp: new Date().toISOString(),
      hasUser: !!process.env.GMAIL_USER,
      hasPassword: !!process.env.GMAIL_APP_PASSWORD
    })

    // Check required credentials
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials not configured')
      return NextResponse.json(
        { error: 'Gmail credentials not configured. Need: GMAIL_USER, GMAIL_APP_PASSWORD' },
        { status: 500 }
      )
    }

    // Create transporter with App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // App Password, not regular password
      },
    })

    // Verify connection
    await transporter.verify()
    console.log('API Route: Gmail App Password connection verified successfully')

    // Send email
    const result = await transporter.sendMail({
      from: `Jet Ride Rentals <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    })

    console.log('API Route: Email sent successfully via Gmail App Password:', {
      messageId: result.messageId,
      to: to,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully'
    })

  } catch (error) {
    console.error('API Route: Gmail App Password sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      },
      { status: 500 }
    )
  }
}
