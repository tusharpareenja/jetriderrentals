interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailVercel(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  // Use Vercel's built-in email functionality
  const emailData = {
    to: to,
    from: 'noreply@jetriderentals.com',
    subject: subject,
    html: html,
    text: text,
  }

  try {
    console.log('Attempting to send email via Vercel:', {
      to: to,
      subject: subject,
      timestamp: new Date().toISOString()
    })

    // Use Vercel's email API
    const response = await fetch('https://api.vercel.com/v1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      throw new Error(`Vercel email API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Email sent successfully via Vercel:', {
      id: result.id,
      to: to,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Vercel email sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}
