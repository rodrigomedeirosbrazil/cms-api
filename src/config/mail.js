require("dotenv/config");
const nodemailer = require("nodemailer");

const mail = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  },
  tls: { rejectUnauthorized: false }
});

module.exports = mail;
