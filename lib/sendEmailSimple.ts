import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailSimple(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  // Use a more reliable SMTP service
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Add connection timeout and retry settings
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,  // 30 seconds
    socketTimeout: 60000,    // 60 seconds
    // Retry settings
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    rateLimit: 1, // 1 email per second
  })

  try {
    // Test connection first
    await transporter.verify()
    console.log('SMTP connection verified successfully')

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
      text: text,
    })

    console.log('Email sent successfully:', {
      messageId: result.messageId,
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Email sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}
