import { Resend } from 'resend';
import { env } from '../config/env.ts';
import { ApiError } from '../utils/ApiError.ts';

const resendClient = env.RESEND_KEY ? new Resend(env.RESEND_KEY) : null;

const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  if (!resendClient) {
    throw ApiError.internal('RESEND_KEY is not configured');
  }

  const { data, error } = await resendClient.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: email,
    subject: 'Reset your password',
    text: `Use this link to reset your password: ${resetUrl}`,
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });

  if (error) {
    console.error('Resend email send failed:', error);
    throw ApiError.internal('Failed to send password reset email');
  }

  console.log(`Password reset email queued for ${email}. Resend id: ${data?.id ?? 'unknown'}`);
};

export { sendPasswordResetEmail };
