const Student = require('../models/Student');

const studentController = {

  getAllStudents: async (req, res) => {
    try {
      const students = await Student.find()
        .populate("classroom", "name teacher");
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id)
        .populate("classroom", "name teacher");
      if (!student) return res.status(404).json({ message: "Siswa tidak ditemukan" });
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createStudent: async (req, res) => {
    try {
      const student = new Student({
        name: req.body.name,
        gender: req.body.gender,
        address: req.body.address,
        birthDate: req.body.birthDate,
        classroom: req.body.classroom,
        isActive: req.body.isActive,
      });

      const newStudent = await student.save();
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateStudent: async (req, res) => {
    try {
      const updated = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ message: "Siswa tidak ditemukan" });
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      const deleted = await Student.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Siswa tidak ditemukan" });
      res.status(200).json({ message: "Siswa berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = studentController;