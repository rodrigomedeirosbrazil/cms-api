const nodemailer = require('nodemailer');

const mail = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  },
  connectionTimeout: 10000,
});

module.exports = mail;
