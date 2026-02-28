import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const sendVerificationEmail = async (user) => {
  // create a token that contain user id
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // build the verification link
  const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  // setup nodemailer 
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_SMTP_KEY
    }
  })

  // send the email
  await transporter.sendMail({
    from: `"MediConnect" <noreply@gmail.com>`,
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
}

module.exports = sendVerificationEmail