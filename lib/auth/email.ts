import nodemailer from "nodemailer"
import crypto from "crypto"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT ?? "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export function generateMagicToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function sendMagicLink(email: string, token: string) {
  const magicLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/magic?token=${token}`

  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@fitlogger.com",
    to: email,
    subject: "Your Magic Link - FitLogger",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🏋️ FitLogger</h1>
        </div>
        
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Magic Link is Ready!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Click the button below to securely log into your FitLogger account. This link will expire in 10 minutes.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold;
                      display: inline-block;">
              🚀 Login to FitLogger
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center;">
            If you didn't request this link, you can safely ignore this email.
          </p>
        </div>
        
        <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
          © 2024 FitLogger. Stay strong, stay consistent! 💪
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
