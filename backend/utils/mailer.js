import nodemailer from 'nodemailer'

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3cb857cd79c25e",
    pass: "5b445e9ef2aae1"
  }
});

const mailOptions = {
    from: 'your-email@example.com', // Sender address
    to: 'recipient@example.com', // Recipient address (can be a comma-separated string for multiple recipients)
    subject: 'Subject of your email',
    text: 'This is the plain text body of your email.', // Plain text body
    html: '<b>This is the HTML body of your email</b>' // HTML body (optional, will be used over text if both are provided)
    // attachments: [ // Optional: Attachments
    //     {
    //         filename: 'example.pdf',
    //         path: '/path/to/your/file.pdf'
    //     }
    // ]
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});