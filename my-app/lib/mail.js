import nodemailer from 'nodemailer';

export const sendResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

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
