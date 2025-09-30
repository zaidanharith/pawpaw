const mongoose = require("mongoose");
const LiveReport = require('../models/LiveReport');
const uploadController = require('./upload.controller');

const liveReportController = {
    getAllLiveReports: async (req, res) => {
        try {
            const liveReports = await LiveReport.find().populate('photos'); 
            res.json(liveReports);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getLiveReportById: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }
            const liveReport = await LiveReport.findById(req.params.id).populate('photos');
            if (!liveReport) {
                return res.status(404).json({ message: 'Live report tidak ditemukan' });
            }
            res.json(liveReport);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createLiveReport: async (req, res) => {
        try {
            let uploadedFile = null;
            if (req.file) {
                uploadedFile = await uploadController._saveFile(req.file); 
            }

            const { title, description, date } = req.body;
            const liveReport = new LiveReport({
                title,
                description,
                date,
                photo: uploadedFile ? uploadedFile._id : null,
            });

            const newLiveReport = await liveReport.save();
            res.status(201).json(newLiveReport);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    updateLiveReport: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }

            const liveReport = await LiveReport.findById(req.params.id);
            if (!liveReport) {
                return res.status(404).json({ message: 'Live report tidak ditemukan' });
            }

            if (req.file) {
                const uploadedFile = await uploadController._saveFile(req.file);
                liveReport.photo = uploadedFile._id;
            }

            liveReport.title = req.body.title || liveReport.title;
            liveReport.description = req.body.description || liveReport.description;
            liveReport.date = req.body.date || liveReport.date;

            const updatedLiveReport = await liveReport.save();
            res.json(updatedLiveReport);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    deleteLiveReport: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "ID tidak valid" });
            }
            
            const liveReport = await LiveReport.findById(req.params.id);
            if (!liveReport) {
                return res.status(404).json({ message: 'Live report tidak ditemukan' });
            }
            await liveReport.remove();
            res.json({ message: 'Live report dihapus' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = liveReportController;
