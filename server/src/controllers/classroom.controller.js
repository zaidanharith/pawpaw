const Classroom = require('../models/Classroom');

const classroomController = {
  // Ambil semua classroom
  getAllClassrooms: async (req, res) => {
    try {
      const classrooms = await Classroom.find()
        .populate("student", "name gender birthDate")
        .populate("teacher", "name email")
        .populate("activity", "title date");
      res.status(200).json(classrooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Ambil classroom berdasarkan ID
  getClassroomById: async (req, res) => {
    try {
      const classroom = await Classroom.findById(req.params.id)
        .populate("student", "name gender birthDate")
        .populate("teacher", "name email")
        .populate("activity", "title date");

      if (!classroom) {
        return res.status(404).json({ message: "Classroom tidak ditemukan" });
      }
      res.status(200).json(classroom);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Buat classroom baru
  createClassroom: async (req, res) => {
    try {
      const classroom = new Classroom({
        name: req.body.name,
        student: req.body.student,   // array of student IDs
        teacher: req.body.teacher,   // teacher ID
        activity: req.body.activity  // array of activity IDs
      });

      const newClassroom = await classroom.save();
      res.status(201).json(newClassroom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update classroom
  updateClassroom: async (req, res) => {
    try {
      const updated = await Classroom.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate("student", "name gender birthDate")
        .populate("teacher", "name email")
        .populate("activity", "title date");

      if (!updated) {
        return res.status(404).json({ message: "Classroom tidak ditemukan" });
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Hapus classroom
  deleteClassroom: async (req, res) => {
    try {
      const deleted = await Classroom.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Classroom tidak ditemukan" });
      }
      res.status(200).json({ message: "Classroom berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = classroomController;
