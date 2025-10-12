import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailSimple(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  try {
    console.log('Attempting to send email via Gmail App Password:', {
      to: to,
      subject: subject,
      timestamp: new Date().toISOString(),
      hasUser: !!process.env.GMAIL_USER,
      hasPassword: !!process.env.GMAIL_APP_PASSWORD
    })

    // Check required credentials
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail credentials not configured. Need: GMAIL_USER, GMAIL_APP_PASSWORD')
    }

    // Create transporter with App Password (Vercel-optimized for SSL)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // App Password, not regular password
      },
      tls: {
        rejectUnauthorized: false // For Vercel compatibility
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
    })

    console.log('About to verify Gmail connection...')
    
    // Verify connection with timeout
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 15000)
      )
    ])
    
    console.log('Gmail App Password connection verified successfully')

    // Send email with timeout
    console.log('About to send email...')
    
    const result = await Promise.race([
      transporter.sendMail({
        from: `Rudra Car Rentals <${process.env.GMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 20000)
      )
    ]) as { messageId: string }

    console.log('Email sent successfully via Gmail App Password:', {
      messageId: result.messageId,
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Gmail App Password sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}