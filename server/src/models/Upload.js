const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Upload", uploadSchema);
