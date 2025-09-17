const mongoose = require('mongoose');

const liveReportSchema = new mongoose.Schema({
    activity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    }],
    date: {
        type: Date,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileUpload'
    }],
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LiveReport', liveReportSchema);