const mongoose = require('mongoose');

const quarterlyReportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // asumsinya teacher tersimpan di User
    required: true
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  activitiesSummary: [{
    type: String
  }],
  notes: {
    type: String
  },
  meetingReminder: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('QuarterlyReport', quarterlyReportSchema);