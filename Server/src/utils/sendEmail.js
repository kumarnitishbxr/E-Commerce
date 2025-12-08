import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,         // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT || 587,  // usually 587
      secure: false,                       // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,      // your email
        pass: process.env.EMAIL_PASS,      // your email password or app password
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error(err.message);
  }
};

export default sendEmail;
