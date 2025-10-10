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

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  try {
    const result = await resend.emails.send({
      from: 'Rudra Car Rentals <onboarding@resend.dev>', // You can change this
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
      to: to,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}
