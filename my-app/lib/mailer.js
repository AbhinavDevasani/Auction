import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Missing SMTP credentials in environment variables.");
    return { success: false, error: "Server configuration error: Missing email credentials. Please restart the dev server if you just added them." };
  }

  const mailOptions = {
    from: `"BidHub Verification" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #f97316;">BidHub Verification</h2>
        <p>Your One-Time Password (OTP) for email verification is:</p>
        <h1 style="font-size: 36px; letter-spacing: 5px; color: #333; background: #f3f4f6; padding: 10px; text-align: center; border-radius: 8px;">${otp}</h1>
        <p style="color: #555;">This code will expire in <strong>5 minutes</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};
