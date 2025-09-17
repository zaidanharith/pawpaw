const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'
    },
    parentPhone: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },  
    class: {
        type: String,
        trim: true
    },
    activity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }]
});

module.exports = mongoose.model('Student', studentSchema);