const Attendance = require('../models/Attendance');

const createAttendance = async (req, res) => {
  try {
    console.log('🔍 req.user:', req.user); 
    console.log('🔍 req.user._Id:', req.user._Id);
    console.log('🔍 req.body:', req.body);
    
    const attendance = new Attendance({
      student: req.body.student,
      date: req.body.date || new Date(),
      status: req.body.status,
      notes: req.body.notes || '',
      createdBy: req.user._Id  // Cek apakah ini ada nilai
    });

    console.log('🔍 Attendance object before save:', attendance);
    
    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    console.log('❌ Error:', error);
    res.status(400).json({ message: error.message });
  }
};


// Get all attendance records
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate('student', 'name')
      .populate('name role')
      .sort({ date: -1 });
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('student', 'name')
      .populate('name role');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update attendance record
const updateAttendance = async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance records by student ID
const getAttendanceByStudent = async (req, res) => {
  try {
    const attendances = await Attendance.find({ student: req.params.studentId })
      .populate('student', 'name')
      .sort({ date: -1 });
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export semua function
module.exports = {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceByStudent
};
