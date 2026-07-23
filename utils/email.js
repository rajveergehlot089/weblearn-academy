// ============================================
// Email Service (Resend)
// ============================================
const { Resend } = require('resend');

const FROM_EMAIL = process.env.EMAIL_FROM || 'WebLearn Academy <onboarding@resend.dev>';
const APP_URL = process.env.APP_URL || 'http://localhost:2007';

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

async function sendEmail({ to, subject, html }) {
  const client = getClient();
  if (!client) {
    console.log(`[Email] Resend not configured. Would send to ${to}: ${subject}`);
    return { id: 'skipped', skipped: true };
  }

  const { data, error } = await client.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('[Email] Send failed:', error);
    throw new Error(error.message || 'Email send failed');
  }

  return { id: data?.id, skipped: false };
}

async function sendVerificationEmail(to, token) {
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
