const mongoose = require('mongoose');

const liveReportSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    activities: [{
        type: String,
        enum: ['Senam', 'Bermain', 'Bercerita', 'Makan Siang'],
        required: true
    }],
    notes: {
        type: String,
        trim: true
    },
    meetingReminder: {
        type: Boolean,
        default: false
    },
    schoolHours: {
        start: {
            type: String,
            default: '08:00'
        },
        end: {
            type: String,
            default: '12:00'
        }
    }
}, {
    timestamps: true
});

// Middleware untuk otomatis set meetingReminder tiap 3 bulan sekali
liveReportSchema.pre('save', function(next) {
    const reportDate = new Date(this.date);
    const month = reportDate.getMonth();

    // Jika bulan = 0, 3, 6, 9 (Jan, Apr, Jul, Okt) → ada pertemuan orang tua
    if ([0, 3, 6, 9].includes(month)) {
        this.meetingReminder = true;
    }
    next();
});

module.exports = mongoose.model('LiveReport', liveReportSchema);