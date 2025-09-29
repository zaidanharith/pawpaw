const mongoose = require("mongoose");
const Attendance = require('../models/Attendance');

const attendanceController = {

  createAttendance: async (req, res) => {
    try {
      const attendance = new Attendance({
        student: req.body.student,
        status: req.body.status,
        notes: req.body.notes || '',
        createdBy: req.user._id
      });
      const savedAttendance = await attendance.save();
      res.status(201).json({
        message: "Data kehadiran berhasil dibuat",
        data: savedAttendance
      }); 
    }catch (error) {
      res.status(400).json({ message: error.message });
    }
  },


  getAllAttendances: async (req, res) => {
    try {
      const attendances = await Attendance.find()
        .populate('student', 'name')
        .populate('createdBy', 'name role')
        .sort({ date: -1 });
      res.status(200).json({
        message: "Daftar kehadiran berhasil diambil",
        data: attendances
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAttendanceById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const attendance = await Attendance.findById(req.params.id)
        .populate('student', 'name')
        .populate('createdBy', 'name role');

      if (!attendance) {
        return res.status(404).json({ message: 'Data kehadiran tidak ditemukan' });
      }
      res.status(200).json({
        message: "Data Kehadiran berhasil ditemukan",
        data: attendance
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const updatedAttendance = await Attendance.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedAttendance) {
        return res.status(404).json({ message: 'Data kehadiran tidak ditemukan' });
      }
      res.status(200).json({
        message: "Data kehadiran berhasil diperbarui",
        data: updatedAttendance
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
      if (!deletedAttendance) {
        return res.status(404).json({ message: 'Data kehadiran tidak ditemukan' });
      }

      res.status(200).json({ message: 'Data kehadiran berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAttendanceByStudent: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }
      
      const attendances = await Attendance.find({ student: req.params.studentId })
        .populate('student', 'name')
        .sort({ date: -1 });
      res.status(200).json({
        message: "Data kehadiran siswa berhasil ditemukan",
        data: attendances
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = attendanceController;
