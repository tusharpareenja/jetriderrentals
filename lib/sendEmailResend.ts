import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailResend(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options;

  console.log('Resend API Key check:', {
    hasKey: !!process.env.RESEND_API_KEY,
    keyLength: process.env.RESEND_API_KEY?.length,
    timestamp: new Date().toISOString()
  });

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  try {
    console.log('Attempting to send email via Resend:', {
      to: to,
      subject: subject,
      from: 'Rudra Car Rentals <noreply@jetriderentals.com>',
      timestamp: new Date().toISOString()
    });

    const result = await resend.emails.send({
      from: 'Rudra Car Rentals <noreply@jetriderentals.com>', // Use your verified domain
      to: [to],
      subject: subject,
      html: html,
      text: text,
    });

    console.log('Email sent successfully via Resend:', {
      id: result.data?.id,
      to: to,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Resend email sending failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      to: to,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}
