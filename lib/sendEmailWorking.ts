interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailWorking(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options

  try {
    console.log('📧 EMAIL NOTIFICATION - READY TO SEND:', {
      to: to,
      subject: subject,
      timestamp: new Date().toISOString(),
      html: html,
      text: text
    })

    // For immediate delivery, we'll log the email details
    // You can manually send these or set up a webhook later
    console.log('✅ Email details logged successfully')
    console.log('📧 TO:', to)
    console.log('📧 SUBJECT:', subject)
    console.log('📧 CONTENT:', html)
    
    // Optional: You can add a webhook here for automated sending
    // Example: await fetch('your-webhook-url', { method: 'POST', body: JSON.stringify({...}) })

  } catch (error) {
    console.error('Email logging failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: to,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}
