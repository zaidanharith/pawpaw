const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // referensi ke User untuk login
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child' // daftar anak yang dimiliki parent ini
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Parent', parentSchema);
