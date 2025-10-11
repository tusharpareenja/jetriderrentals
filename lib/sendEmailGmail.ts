import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailGmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  // Gmail SMTP configuration optimized for Vercel
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
    },
    // Vercel-optimized settings
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  })

  try {
    console.log('Attempting to send email via Gmail:', {
      to: to,
      subject: subject,
      timestamp: new Date().toISOString()
    })

    // Test connection
    await transporter.verify()
    console.log('Gmail SMTP connection verified successfully')

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
      text: text,
    })

    console.log('Email sent successfully via Gmail:', {
      messageId: result.messageId,
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Gmail email sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}
