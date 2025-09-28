const Classroom = require('../models/Classroom');

const getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate('student', 'name')       
      .populate('teacher', 'name')       
      .populate('activity', 'title');    
    res.status(200).json({
      message: "Daftar classroom berhasil diambil",
      data: classrooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('student', 'name')
      .populate('teacher', 'name')
      .populate('activity', 'title');

    if (!classroom) {
      return res.status(404).json({ message: "Classroom tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail classroom berhasil diambil",
      data: classroom
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClassroom = async (req, res) => {
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
};

const updateClassroom = async (req, res) => {
  try {
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedClassroom) {
      return res.status(404).json({ message: "Classroom tidak ditemukan" });
    }

    res.status(200).json({
      message: "Classroom berhasil diperbarui",
      data: updatedClassroom
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteClassroom = async (req, res) => {
  try {
    const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);

    if (!deletedClassroom) {
      return res.status(404).json({ message: "Classroom tidak ditemukan" });
    }

    res.status(200).json({ message: "Classroom berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom
};
