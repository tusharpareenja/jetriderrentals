import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailNodemailer(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  // Use SendGrid SMTP with retry logic
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'apikey', // This is literally the string 'apikey'
      pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
    },
    // More aggressive timeout settings
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 15000,    // 15 seconds
    socketTimeout: 30000,     // 30 seconds
    pool: false, // Disable pooling to avoid connection issues
    maxConnections: 1,
    maxMessages: 1,
    rateLimit: 2, // 2 seconds between emails
  })

  // Retry logic
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`SendGrid attempt ${attempt}/${maxRetries} for ${to}`);
      
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
        attempt: attempt,
        timestamp: new Date().toISOString()
      })
      
      return; // Success, exit retry loop

    } catch (error) {
      lastError = error;
      console.error(`SendGrid attempt ${attempt} failed:`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        code: (error as { code?: string })?.code,
        to: to,
        attempt: attempt,
        timestamp: new Date().toISOString()
      })

      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // 2s, 4s, 6s delays
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  console.error('SendGrid email sending failed after all retries:', {
    error: lastError instanceof Error ? lastError.message : 'Unknown error',
    code: (lastError as { code?: string })?.code,
    to: to,
    totalAttempts: maxRetries,
    timestamp: new Date().toISOString()
  })
  
  throw lastError;
}

