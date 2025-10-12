export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailSimple(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  try {
    console.log('Attempting to send email via Resend API:', {
      to: to,
      subject: subject,
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.RESEND_API_KEY
    })

    // Check required credentials
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key not configured. Need: RESEND_API_KEY')
    }

    // Send email via Resend API (Vercel-optimized)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Rudra Car Rentals <noreply@jetriderentals.com>',
        to: [to],
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Resend API error: ${errorData.message || response.statusText}`)
    }

    const result = await response.json()

    console.log('Email sent successfully via Resend API:', {
      id: result.id,
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Resend API sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}