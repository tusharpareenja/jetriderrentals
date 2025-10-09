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

  const tp = getTransporter()
  await tp.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}


