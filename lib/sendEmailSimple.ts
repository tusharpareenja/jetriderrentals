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
      timestamp: new Date().toISOString()
    })

    // Use Resend API directly
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
      })
    })

    console.log('Resend Response Status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Resend Error Response:', errorText)
      throw new Error(`Resend API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Email sent successfully via Resend:', {
      result: result,
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Resend sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}