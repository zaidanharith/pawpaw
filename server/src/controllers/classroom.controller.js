const mongoose = require("mongoose");
const Classroom = require('../models/Classroom');

const classroomController = {

  getAllClassrooms: async (req, res) => {
    try {
      const classrooms = await Classroom.find()
        .populate('student', 'name')       
        .populate('teacher', 'name')       
        .populate('activity', 'title');  

      res.status(200).json({
        message: "Daftar kelas ditemukan",
        data: classrooms
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getClassroomById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const classroom = await Classroom.findById(req.params.id)
        .populate('student', 'name')
        .populate('teacher', 'name')
        .populate('activity', 'title');

      if (!classroom) {
        return res.status(404).json({ message: "Kelas tidak ditemukan" });
      }

      res.status(200).json({
        message: "Detail kelas ditemukan",
        data: classroom
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createClassroom: async (req, res) => {
    try {
      const classroom = new Classroom({
        name: req.body.name,
        student: req.body.student,   
        teacher: req.body.teacher,   
        activity: req.body.activity  
      });

      const newClassroom = await classroom.save();
      res.status(201).json({
        message: "Classroom berhasil dibuat",
        data: newClassroom
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateClassroom: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const updatedClassroom = await Classroom.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedClassroom) {
        return res.status(404).json({ message: "Kelas tidak ditemukan" });
      }

      res.status(200).json({
        message: "Kelas berhasil diperbarui",
        data: updatedClassroom
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteClassroom: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }
      
      const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);

      if (!deletedClassroom) {
        return res.status(404).json({ message: "Kelas tidak ditemukan" });
      }

      res.status(200).json({ message: "Kelas berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = classroomController;
