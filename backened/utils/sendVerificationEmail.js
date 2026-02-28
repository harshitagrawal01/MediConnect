import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const sendVerificationEmail = async (user) => {
  try {
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const verifyURL = `${process.env.BACKEND_URL}/api/user/verify-email/${token}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY
      }
    })

    const info = await transporter.sendMail({
      from: `"MediConnect" <a3930b001@smtp-brevo.com>`,
      to: user.email,
      subject: 'Verify your MediConnect account',
      html: `
        <h2>Welcome to MediConnect, ${user.name}!</h2>
        <p>Thanks for registering. Please verify your email by clicking the button below:</p>
        <a href="${verifyURL}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create this account, ignore this email.</p>
      `
    });

    return info

  } catch (error) {
    console.error("❌ Email sending failed:", error.message)
    throw error  // this will bubble up to registerUser and show in Render logs
  }
}

export default sendVerificationEmail