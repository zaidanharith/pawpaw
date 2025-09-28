const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
  }],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    }]
});

module.exports = mongoose.model('Classroom', classroomSchema);