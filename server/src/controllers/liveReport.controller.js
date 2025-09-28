const LiveReport = require('../models/LiveReport');
const Classroom = require("../models/Classroom");
const Upload = require('../models/Upload');

const liveReportController = {
  // Get all live reports
  getAllLiveReports: async (req, res) => {
    try {
      const liveReports = await LiveReport.find()
        .populate("activity", "title description")
        .populate({
          path: "classroom",
          select: "name teacher student activity",
          populate: [
            { path: "teacher", select: "name role" },
            { path: "student", select: "name" },
            { path: "activity", select: "title description" }
          ]
        })
        .populate("photo", "filename originalName path");

      res.json({
        message: "Berhasil mengambil data live report",
        data: liveReports
      });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  },

  // Get live report by ID
  getLiveReportById: async (req, res) => {
    try {
      const liveReport = await LiveReport.findById(req.params.id)
        .populate("activity", "title description")
        .populate({
          path: "classroom",
          select: "name teacher student activity",
          populate: [
            { path: "teacher", select: "name role" },
            { path: "student", select: "name" },
            { path: "activity", select: "title description" }
          ]
        })
        .populate("photo", "filename originalName path");

      if (!liveReport) {
        return res.status(404).json({ message: 'Live report tidak ditemukan' });
      }

      res.json({
        message: "Berhasil mengambil data live report berdasarkan ID",
        data: liveReport
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create a new live report
  createLiveReport: async (req, res) => {
    try {
      const { title, description, date, activity, classroom } = req.body;

      const classroomData = await Classroom.findById(classroom);
      if (!classroomData) {
        return res.status(404).json({ message: "Classroom tidak ditemukan" });
      }

      let uploadedPhoto = null;
      if (req.file) {
        uploadedPhoto = await Upload.create({
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          path: req.file.path
        });
      }

      const liveReport = new LiveReport({
        title,
        description,
        date: date || new Date(),
        activity,
        classroom: classroomData._id,
        photo: uploadedPhoto ? [uploadedPhoto._id] : []
      });

      const newLiveReport = await liveReport.save();
      res.status(201).json({
        message: "Live report berhasil dibuat",
        data: newLiveReport
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },


  // Update a live report
  updateLiveReport: async (req, res) => {
    try {
      const liveReport = await LiveReport.findById(req.params.id);
      if (!liveReport) {
        return res.status(404).json({ message: 'Live report tidak ditemukan' });
      }

      if (req.file) {
        const uploadedPhoto = await Upload.create({
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          path: req.file.path
        });
        liveReport.photo.push(uploadedPhoto._id);
      }

      liveReport.title = req.body.title || liveReport.title;
      liveReport.description = req.body.description || liveReport.description;
      liveReport.date = req.body.date || liveReport.date;
      liveReport.activity = req.body.activity || liveReport.activity;
      liveReport.classroom = req.body.classroom || liveReport.classroom;

      const updatedLiveReport = await liveReport.save();
      res.json({
        message: "Live report berhasil diperbarui",
        data: updatedLiveReport
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete a live report
  deleteLiveReport: async (req, res) => {
    try {
      const liveReport = await LiveReport.findById(req.params.id);
      if (!liveReport) {
        return res.status(404).json({ message: 'Live report tidak ditemukan' });
      }

      await LiveReport.findByIdAndDelete(req.params.id);

      res.json({ message: 'Live report berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = liveReportController;