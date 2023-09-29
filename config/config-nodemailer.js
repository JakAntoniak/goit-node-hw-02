import nodemailer from "nodemailer";
import env from "dotenv";

env.config();

export const sendVerificationEmail = async (email, subject, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "noreply@gmail.com",
      to: email,
      subject: subject,
      text: `Hello, ${email}.\n\nPlease click on the link below to verify your account.\n${link}`,
    });
  } catch (error) {
    return error;
  }
};
