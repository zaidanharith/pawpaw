const Teacher = require('../models/teacherModel');
const LiveReport = require('../models/liveReportModel');
const Announcement = require('../models/announcementModel');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate("user");
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate("user");
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create teacher
exports.createTeacher = async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        const savedTeacher = await teacher.save();
        res.status(201).json(savedTeacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTeacher) return res.status(404).json({ message: "Teacher not found" });
        res.status(200).json(updatedTeacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!deletedTeacher) return res.status(404).json({ message: "Teacher not found" });
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Fitur khusus teacher

// Teacher uploads daily report
exports.createLiveReport = async (req, res) => {
    try {
        const report = new LiveReport({
            teacher: req.user.id, // dari JWT / session login
            ...req.body
        });
        const savedReport = await report.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Teacher creates announcement
exports.createAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement({
            teacher: req.user.id,
            ...req.body
        });
        const savedAnnouncement = await announcement.save();
        res.status(201).json(savedAnnouncement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
