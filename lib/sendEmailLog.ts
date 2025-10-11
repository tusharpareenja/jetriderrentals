interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailLog(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  try {
    console.log('📧 EMAIL TO SEND:', {
      to: to,
      subject: subject,
      html: html,
      text: text,
      timestamp: new Date().toISOString()
    })

    // For now, just log the email details
    // You can manually send these emails or set up a webhook later
    console.log('✅ Email logged successfully - ready for manual sending')
    
    // Optional: You can add a webhook here later
    // await fetch('your-webhook-url', { method: 'POST', body: JSON.stringify({...}) })

  } catch (error) {
    console.error('Email logging failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}
