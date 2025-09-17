const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
     subject: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Teacher', teacherSchema);