const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    student: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }],
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'At least one student is required'
        }
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activity: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }],
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'At least one activity is required'
        }
    }
});

module.exports = mongoose.model('Classroom', classroomSchema);