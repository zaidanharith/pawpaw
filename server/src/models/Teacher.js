const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    parentId: {
        type: String,
        required: false
    },
    subject: {
        type: String,
        required: false
    }
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;