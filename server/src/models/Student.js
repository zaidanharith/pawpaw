const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    address: {
        type: String,
        trim: true,
    },
    birthDate : {
        type: Date,
        required: true,
        trim: true,
    }, 
    class: {
        type: String,
        trim: true,
    },
    status : {
        type: Boolean,
        required: true,
    },
    attendance : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance',
        required: true,
    },
});

module.exports = mongoose.model('Student', studentSchema);