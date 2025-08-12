const express = require('express');
const crypto = require('crypto');
const Booking = require('./models/bookings'); 

// Import email service
const {
  sendBookingSuccess,
  sendBookingFailed,
} = require('./services/emailService');

const router = express.Router();

// PAYSTACK WEBHOOK
router.post('/', express.json({ type: '*/*' }), async (req, res) => {
  try {
    
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    
    if (event.event === 'charge.success') {
      const updatedBooking = await Booking.findOneAndUpdate(
        { paymentReference: event.data.reference },
        { paymentStatus: 'successful' },
        { new: true }
      );

      if (updatedBooking) {
        // Send success email
        sendBookingSuccess(updatedBooking.user.email, updatedBooking).catch(console.error);
      }
    } else if (event.event === 'charge.failed') {
      const updatedBooking = await Booking.findOneAndUpdate(
        { paymentReference: event.data.reference },
        { paymentStatus: 'failed' },
        { new: true }
      );

      if (updatedBooking) {
        // Send failure email
        sendBookingFailed(updatedBooking.user.email, updatedBooking).catch(console.error);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
