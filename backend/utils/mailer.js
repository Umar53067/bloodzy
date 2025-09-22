import nodemailer from "nodemailer";



// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   secure: false, 
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASS,
//   },
//     auth: "LOGIN", // 👈 force LOGIN instead of PLAIN
// });

// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0c8d89f2462cea",
    pass: "3ef67932ac06c2"
  }
});

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
      from: '"MyApp Support" <no-reply@bloodzy.com>', // Send
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
