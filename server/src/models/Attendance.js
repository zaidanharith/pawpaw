const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Hadir", "Alfa", "Sakit", "Izin"], 
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);