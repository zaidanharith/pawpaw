const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher', // kita bisa buat model Teacher terpisah
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    photos: [{
        type: String // simpan URL foto aktivitas
    }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
