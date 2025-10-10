import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter

  const host = process.env.EMAIL_HOST
  const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASSWORD
  const from = process.env.EMAIL_FROM

  if (!host || !port || !user || !pass || !from) {
    throw new Error('Missing required email environment variables')
  }

  

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  })

  return transporter
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  const from = process.env.EMAIL_FROM
  if (!from) {
    throw new Error('EMAIL_FROM is not configured')
  }

  // Verify transporter before sending
  const tp = getTransporter()
  
  try {
    // Verify connection first
    await tp.verify()
    console.log('SMTP connection verified successfully');
  } catch (error) {
    console.error('SMTP connection failed:', error);
    throw new Error(`SMTP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  try {
    const result = await tp.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    
    console.log('Email sent successfully:', {
      messageId: result.messageId,
      to: to,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    const errorInfo = {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      response: (error as { response?: string })?.response,
      to: to,
      timestamp: new Date().toISOString()
    };
    console.error('Email sending failed:', errorInfo);
    throw error;
  }
}


