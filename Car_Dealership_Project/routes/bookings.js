const express = require('express');
const router = express.Router();
const Booking = require('../models/bookings');
const Car = require('../models/car');
const { verifyToken, verifyAdmin } = require('./middleware/auth');
const Paystack = require('paystack-api');
require('dotenv').config();

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

// Import email service
const { sendBookingPending } = require('../services/emailService');

// CREATE a new booking just for users
router.post('/', verifyToken, async (req, res) => {
  try {
    const { car, startDate, endDate } = req.body;

    // Check if the car already exists
    const carExists = await Car.findById(car);
    if (!carExists) return res.status(404).json({ message: 'Car not found' });

    // Calculate booking days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Convert ms → days

    if (days <= 0) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Fixed price per day
    const pricePerDay = 45000;
    const totalAmount = days * pricePerDay;

    // Create booking
    const newBooking = new Booking({
      carMake: carExists.make,
      carModel: carExists.model,
      car: carExists._id,
      user: req.user.id,
      startDate: start,
      endDate: end,
      totalAmount,
      paymentStatus: 'pending', 
    });

    const savedBooking = await newBooking.save();

    // Send pending booking email
    sendBookingPending(req.user.email, savedBooking).catch(console.error);

    // Initialize Paystack payment using SDK
    const paymentInit = await paystack.transaction.initialize({
      email: req.user.email, 
      amount: totalAmount * 100, 
      callback_url: process.env.PAYSTACK_CALLBACK_URL,
      metadata: {
        bookingId: savedBooking._id.toString(), // so you can track payment by bookingId
      },
    });

    // Return payment link to frontend
    res.status(201).json({
      message: 'Booking created, proceed to payment',
      booking: savedBooking,
      paymentLink: paymentInit.data.authorization_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking error', error: err.message });
  }
});
