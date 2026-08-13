import { Request, Response, NextFunction } from "express";
import { ContactServices } from "./contact.services";

const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields.",
      });
    }

    const result = await ContactServices.sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      data: result,
      message: "Email sent successfully!",
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: err instanceof Error ? err.message : err,
    });
  }
};

export const ContactController = {
  sendEmail,
};
