import jwt from 'jsonwebtoken'

const sendVerificationEmail = async (user) => {
  try {
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const verifyURL = `${process.env.BACKEND_URL}/api/user/verify-email/${token}`;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'MediConnect', email: 'a3930b001@smtp-brevo.com' },
        to: [{ email: user.email, name: user.name }],
        subject: 'Verify your MediConnect account',
        htmlContent: `
          <h2>Welcome to MediConnect, ${user.name}!</h2>
          <p>Please verify your email by clicking the button below:</p>
          <a href="${verifyURL}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
            Verify Email
          </a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create this account, ignore this email.</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email')
    }

    return data

  } catch (error) {
    console.error("❌ Email sending failed:", error.message)
    throw error
  }
}

export default sendVerificationEmail
