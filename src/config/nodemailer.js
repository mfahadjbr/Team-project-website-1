// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default transporter;


// ../config/nodemailer.js

import nodemailer from 'nodemailer';
import { config } from '../../config.js';

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: parseInt(config.EMAIL_PORT), // Parse port to integer
  secure: false, // For port 587, use false as it uses STARTTLS
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
  tls: {
    // This is often important, especially in development, to prevent self-signed cert errors.
    // In production, ideally, you'd want proper certificates and could set this to true.
    rejectUnauthorized: false
  }
});

// Optional: Verify the connection when the app starts
transporter.verify(function(error, success) {
  if (error) {
    console.error("Nodemailer Transporter Verification Error:", error);
    // You might want to exit the process or handle this more robustly in production
  } else {
    console.log("Nodemailer Transporter is ready to send messages (Gmail)");
  }
});

export default transporter;