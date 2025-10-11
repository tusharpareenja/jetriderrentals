import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailNodemailer(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  // Use SendGrid SMTP (recommended for Vercel)
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'apikey', // This is literally the string 'apikey'
      pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
    },
    // Connection settings for Vercel
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,    // 30 seconds
    socketTimeout: 60000,     // 60 seconds
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    rateLimit: 1, // 1 email per second
  })

  try {
    // Test connection first
    await transporter.verify()
    console.log('SendGrid SMTP connection verified successfully')

    const result = await transporter.sendMail({
      from: 'noreply@jetriderentals.com', // Use your domain
      to: to,
      subject: subject,
      html: html,
      text: text,
    })

    console.log('Email sent successfully via SendGrid:', {
      messageId: result.messageId,
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('SendGrid email sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}

