const express = require('express');
const router = express.Router();
const Paystack = require('paystack-api');
const Booking = require('../models/bookings'); 
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

const { initiatePayment, verifyPayment } = require('../controller/paymentController');

router.post('/initiate', initiatePayment);
router.get('/verify', verifyPayment);

router.get('/callback', async (req, res) => {
  const reference = req.query.reference;

  try {
    // work with paystack API (Paystack SDK)
    const verifyResponse = await paystack.transaction.verify(reference);

    const paymentData = verifyResponse.data;

    if (paymentData.status === 'success') {
      const bookingId = paymentData.metadata.bookingId;
      // Update booking payment status to 'Paid'
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'Paid' });
      return res.redirect('/payment-success.html');
    } else {
      return res.redirect('/payment-failed.html');
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;
