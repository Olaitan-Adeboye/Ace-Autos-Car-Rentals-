const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    price: Number,
    imageUrl: String,
    available:{
        type: Boolean
    },
});

module.exports = mongoose.model('Car', carSchema);