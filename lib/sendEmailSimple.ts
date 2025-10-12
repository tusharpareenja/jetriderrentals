export const runtime = 'nodejs';
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

    // Send email via Resend API (Vercel-optimized with retry)
    let response;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        console.log(`Resend API attempt ${retryCount + 1}/${maxRetries}`);
        
        response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
            'User-Agent': 'RudraCarRentals/1.0'
          },
          body: JSON.stringify({
            from: 'Rudra Car Rentals <noreply@jetriderentals.com>',
            to: [to],
            subject: subject,
            html: html,
            text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
          }),
        });
        
        break; // Success, exit retry loop
      } catch (fetchError) {
        retryCount++;
        console.log(`Fetch attempt ${retryCount} failed:`, fetchError);
        
        if (retryCount >= maxRetries) {
          throw fetchError;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    if (!response || !response.ok) {
      const errorData = response ? await response.json() : { message: 'No response received' }
      throw new Error(`Resend API error: ${errorData.message || (response ? response.statusText : 'Unknown error')}`)
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