import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: `"BidHub Verification" <${process.env.EMAIL_USER}>`,
  to: "abhinavdevasani18@gmail.com",
  subject: "Your OTP Code Test",
  text: "123456",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});
