const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  carMake: { type: String, required: true },
  carModel: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  totalAmount: { type: Number, required: true },


paymentStatus: {
  type: String,
  enum: ['Pending', 'Paid', 'Failed'],
  default: 'Pending'
},
// Payment tracking
    paymentReference: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
}, { timestamps: true },
);


module.exports = mongoose.model('Booking', bookingSchema);
