import nodemailer from 'nodemailer';

/**
 * Env (pick one setup):
 *
 * Gmail / known providers:
 *   EMAIL_USER, EMAIL_PASS
 *   EMAIL_SERVICE=gmail (default)
 *
 * Custom SMTP (recommended for KL / org mail):
 *   EMAIL_USER, EMAIL_PASS
 *   SMTP_HOST, SMTP_PORT (default 587), SMTP_SECURE=false
 */

export function isMailConfigured() {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

export function getMailConfigurationStatus() {
  const hasUser = !!process.env.EMAIL_USER;
  const hasPass = !!process.env.EMAIL_PASS;
  const mode = process.env.SMTP_HOST ? 'smtp' : 'service';
  return {
    configured: hasUser && hasPass,
    mode,
    missing: [!hasUser && 'EMAIL_USER', !hasPass && 'EMAIL_PASS'].filter(Boolean),
    smtpHostSet: !!process.env.SMTP_HOST,
  };
}

export function createMailTransport() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set');
  }

  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user, pass },
  });
}

export const sendResetEmail = async (email, token) => {
  const transporter = createMailTransport();

  const mailOptions = {
    from: `"Smart Village Revolution" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - SVR Portal',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #008000;">Smart Village Revolution Portal</h2>
        <p>You requested a password reset. Please use the following code to reset your password:</p>
        <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px; color: #008000; letter-spacing: 5px;">
          ${token}
        </div>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">© 2024 Smart Village Revolution. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
