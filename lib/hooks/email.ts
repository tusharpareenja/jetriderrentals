import { EmailService } from '@/app/actions/email';
import { useState } from 'react';

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
}

const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (emailData: EmailData): Promise<SendEmailResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await EmailService(emailData);

      if (!response) {
        throw new Error('Failed to send email');
      }

      setLoading(false);
      return { success: true, message: "Email sent succesfully !" };
    } catch (err: unknown) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  return { sendEmail, loading, error };
};

export default useSendEmail;