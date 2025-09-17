const mongoose = require('mongoose');

const weatherCacheSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    cachedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('WeatherCache', weatherCacheSchema);