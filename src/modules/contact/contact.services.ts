import nodemailer from "nodemailer";

const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!user || !pass) {
    throw new Error("SMTP credentials are not configured in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"${name}" <${from}>`,
    replyTo: email,
    to: user, // Sends to the owner's mail address
    subject: `[Portfolio Contact] ${subject || "New Message"}`,
    text: `You have received a new message from your portfolio contact form:
    
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}`,
    html: `
      <h2>New Portfolio Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

export const ContactServices = {
  sendContactEmail,
};
