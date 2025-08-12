const Paystack = require('paystack-api');
const Booking = require('../models/bookings');
require('dotenv').config();

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

// INITIATE PAYMENT
const initiatePayment = async (req, res) => {
    try {
        const { bookingId, email } = req.body;

        // 1. Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // 2. Make sure its *100 cos Paystack uses kobo
        const amountInKobo = booking.totalAmount * 100;

        // 3. Send request to Paystack api (SDK)
        const response = await paystack.transaction.initialize({
            email,
            amount: amountInKobo,
            callback_url: process.env.PAYSTACK_CALLBACK_URL,
              metadata: { bookingId }
        });

        // 4. Return the payment link
        res.status(200).json({
            message: 'Payment initiated',
            data: response.data
        });

    } catch (error) {
        res.status(500).json({
            message: 'Payment initiation failed',
            error: error.response?.data || error.message
        });
    }
};

// VERIFY PAYMENT
const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;

        // Verify payment using SDK
        const response = await paystack.transaction.verify(reference);

        res.status(200).json({
            message: 'Payment verification successful',
            data: response.data
        });

    } catch (error) {
        res.status(500).json({
            message: 'Payment verification failed',
            error: error.response?.data || error.message
        });
    }
};

module.exports = { initiatePayment, verifyPayment };
