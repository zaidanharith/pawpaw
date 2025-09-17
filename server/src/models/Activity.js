const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Senam', 'Bermain', 'Bercerita', 'Makan Siang'],
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);