// ============================================
// Email Service (Resend)
// ============================================
const { Resend } = require('resend');
const logger = require('./logger');

const FROM_EMAIL = process.env.EMAIL_FROM || 'WebLearn Academy <onboarding@resend.dev>';
const APP_URL = process.env.APP_URL || (process.env.NODE_ENV === 'production' ? null : 'http://localhost:2007');

if (process.env.NODE_ENV === 'production' && !process.env.APP_URL) {
  console.warn('WARNING: APP_URL is not set. Email links will not work. Set APP_URL in your environment variables.');
}

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

async function sendEmail({ to, subject, html }) {
  const client = getClient();
  if (!client) {
    logger.info({ to, subject }, 'Resend not configured, email skipped');
    return { id: 'skipped', skipped: true };
  }

  const { data, error } = await client.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    logger.error({ err: error, to, subject }, 'Email send failed');
    throw new Error(error.message || 'Email send failed');
  }

  return { id: data?.id, skipped: false };
}

async function sendVerificationEmail(to, token) {
  if (!APP_URL) {
    logger.warn('Cannot send verification email: APP_URL is not configured');
    return { id: 'skipped', skipped: true };
  }
  const link = `${APP_URL}/verify-email?token=${token}`;
  return sendEmail({
    to,
    subject: 'Verify your WebLearn Academy account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #333;">Welcome to WebLearn Academy!</h2>
        <p style="color: #555; line-height: 1.6;">
          Please verify your email address by clicking the button below.
          This link expires in 24 hours.
        </p>
        <a href="${link}"
           style="display: inline-block; background: #667eea; color: #fff; padding: 12px 24px;
                  border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #999; font-size: 13px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(to, token) {
  if (!APP_URL) {
    logger.warn('Cannot send password reset email: APP_URL is not configured');
    return { id: 'skipped', skipped: true };
  }
  const link = `${APP_URL}/reset-password?token=${token}`;
  return sendEmail({
    to,
    subject: 'Reset your WebLearn Academy password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555; line-height: 1.6;">
          We received a request to reset your password. Click the button below to set a new password.
          This link expires in 1 hour.
        </p>
        <a href="${link}"
           style="display: inline-block; background: #667eea; color: #fff; padding: 12px 24px;
                  border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 13px;">
          If you didn't request a password reset, you can safely ignore this email.
          Your password will remain unchanged.
        </p>
      </div>
    `,
  });
}

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
