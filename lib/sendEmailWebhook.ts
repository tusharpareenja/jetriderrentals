interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailWebhook(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  // Use a simple webhook service like Zapier or Make.com
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/your-webhook-url'

  try {
    console.log('Attempting to send email via webhook:', {
      to: to,
      subject: subject,
      timestamp: new Date().toISOString()
    })

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        subject: subject,
        html: html,
        text: text,
        from: 'Rudra Car Rentals <noreply@jetriderentals.com>'
      })
    })

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`)
    }

    console.log('Email sent successfully via webhook:', {
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Webhook email sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}
