import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";
dotenv.config();
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER, // generated ethereal user
    pass: process.env.GMAIL_PASS, // generated ethereal password
  },
});
transporter.verify().then(() => {
  console.log("Ready for send emails");
});
