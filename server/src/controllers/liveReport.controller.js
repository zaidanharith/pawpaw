const LiveReport = require('../models/LiveReport');

const liveReportController = {
  getAllLiveReports: async (req, res) => {
    try {
      const liveReports = await LiveReport.find()
        .populate("activity", "title description")
        .populate("teacher", "name role")
        .populate("photos", "url filename");
      res.status(200).json(liveReports);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getLiveReportById: async (req, res) => {
    try {
      const liveReport = await LiveReport.findById(req.params.id)
        .populate("activity", "title description")
        .populate("teacher", "name role")
        .populate("photos", "url filename");
      if (!liveReport) {
        return res.status(404).json({ message: "Live report not found" });
      }
      res.status(200).json(liveReport);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createLiveReport: async (req, res) => {
    try {
      const liveReport = new LiveReport({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date || new Date(),
        activity: req.body.activity, 
        teacher: req.user._id,       
        photos: req.file ? [req.file._id] : []
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

  updateLiveReport: async (req, res) => {
    try {
      const liveReport = await LiveReport.findById(req.params.id);
      if (!liveReport) {
        return res.status(404).json({ message: "Live report not found" });
      }

      liveReport.title = req.body.title || liveReport.title;
      liveReport.description = req.body.description || liveReport.description;
      liveReport.date = req.body.date || liveReport.date;
      liveReport.activity = req.body.activity || liveReport.activity;

      if (req.file) {
        liveReport.photos = [...liveReport.photos, req.file._id];
      }

      const updatedLiveReport = await liveReport.save();
      res.status(200).json({
        message: "Live report berhasil diperbarui",
        data: updatedLiveReport
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteLiveReport: async (req, res) => {
    try {
      const liveReport = await LiveReport.findByIdAndDelete(req.params.id);
      if (!liveReport) {
        return res.status(404).json({ message: "Live report not found" });
      }
      res.status(200).json({ message: "Live report berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = liveReportController;
