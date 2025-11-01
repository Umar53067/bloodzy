import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure transporter based on environment
let transporter;

if (process.env.NODE_ENV === "production") {
  // Production email configuration (use your production email service)
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail", // e.g., 'gmail', 'sendgrid', etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Development email configuration (Mailtrap or similar)
  transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.MAILTRAP_PORT || 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
}

export const sendEmail = async ({ to, subject, text, html }) => {
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection error:", error);
    } else {
      console.log("SMTP server is ready to send messages ✅");
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Bloodzy Support" <no-reply@bloodzy.com>',
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};
