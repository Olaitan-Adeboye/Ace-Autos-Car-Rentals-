const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    identity: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

})

module.exports = mongoose.model('User', userSchema);