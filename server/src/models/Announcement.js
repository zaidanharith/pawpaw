const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // relasi ke model User
        required: false
    },
    isImportant: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // otomatis bikin createdAt & updatedAt
});

module.exports = mongoose.model('Announcement', announcementSchema);
