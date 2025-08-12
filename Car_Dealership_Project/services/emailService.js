
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your email provider
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Send booking payment success email
async function sendBookingSuccess(email, booking) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Payment Successful',
    text: `Dear Customer,

Your booking with ID ${booking._id} has been successfully paid.
Thank you for choosing our service.

Best regards,
Car Dealership Team`,
  };

  return transporter.sendMail(mailOptions);
}

// Send booking payment failure email
async function sendBookingFailed(email, booking) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Payment Failed',
    text: `Dear Customer,

Unfortunately, the payment for your booking with ID ${booking._id} has failed.
Please try again or contact support for assistance.

Best regards,
Ace Autos Team`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendBookingSuccess,
  sendBookingFailed,
};
