import { User, IUser } from "../user/user.model";
import nodemailer from "nodemailer";

const loginWithEmailAndPassword = async ({ email, password }: { email: string; password: string }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User does not exist.");
  }

  if (password === user.password) {
    return user;
  } else {
    throw new Error("Password does not match.");
  }
};

const loginWithGoogle = async (data: Partial<IUser>) => {
  let user = await User.findOne({ email: data.email });

  if (!user) {
    user = await User.create(data);
  }

  return user;
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User with this email does not exist.");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  user.resetPasswordToken = otp;
  user.resetPasswordExpires = new Date(Date.now() + 600000); // 10 minutes
  await user.save();

  console.log(`🔑 [PASSWORD RESET OTP] For ${email}: ${otp}`);

  // Send real email if SMTP credentials are provided
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  
  if (smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Portfolio Manager" <${smtpUser}>`,
        to: email,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`,
        html: `<h3>Password Reset OTP</h3>
               <p>Your password reset OTP is <strong>${otp}</strong>.</p>
               <p>This code is valid for 10 minutes.</p>`,
      });
      console.log(`📧 Reset OTP sent via email to ${email}`);
    } catch (err) {
      console.error("Nodemailer failed to send email:", err);
    }
  }

  return { otp }; // return OTP in response for development helper
};

const resetPassword = async ({ email, otp, newPassword, confirmPassword }: any) => {
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found.");
  }

  if (
    !user.resetPasswordToken ||
    user.resetPasswordToken !== otp ||
    !user.resetPasswordExpires ||
    user.resetPasswordExpires < new Date()
  ) {
    throw new Error("Invalid or expired OTP.");
  }

  // Save new plain password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return user;
};

export const AuthServices = {
  loginWithEmailAndPassword,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
};