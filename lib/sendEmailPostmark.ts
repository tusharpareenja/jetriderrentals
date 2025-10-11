import { ServerClient } from 'postmark'

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailPostmark(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  if (!process.env.POSTMARK_API_TOKEN) {
    throw new Error('POSTMARK_API_TOKEN is not configured')
  }

  const client = new ServerClient(process.env.POSTMARK_API_TOKEN)

  try {
    console.log('Attempting to send email via Postmark:', {
      to: to,
      subject: subject,
      timestamp: new Date().toISOString()
    })

    const result = await client.sendEmail({
      From: 'noreply@jetriderentals.com',
      To: to,
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
      MessageStream: 'outbound'
    })

    console.log('Email sent successfully via Postmark:', {
      messageId: result.MessageID,
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Postmark email sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}
