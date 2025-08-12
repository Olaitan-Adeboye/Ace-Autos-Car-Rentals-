
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const connectDB = require('./database');
const cors = require('cors');

// Initialise the app
const app = express();

// Connect to MongoDB
connectDB();


app.use(express.json());
app.use(cors());

const webhookRoute = require('./webhook');
console.log('Webhook route:', webhookRoute);


app.use('/api/cars', require('./routes/cars'));
app.use('/api/user', require('./routes/user'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/webhook', webhookRoute);

app.get('/', (req, res) => {
    res.send('Welcome to Ace Autos');
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
