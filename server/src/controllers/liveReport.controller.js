const LiveReport = require('../models/LiveReport');

// Get all live reports
exports.getAllLiveReports = async (req, res) => {
    try {
        const liveReports = await LiveReport.find();
        res.json(liveReports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get live report by ID
exports.getLiveReportById = async (req, res) => {
    try {
        const liveReport = await LiveReport.findById(req.params.id);
        if (!liveReport) {
            return res.status(404).json({ message: 'Live report not found' });
        }
        res.json(liveReport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new live report
exports.createLiveReport = async (req, res) => {
    const { title, description, date } = req.body;
    const liveReport = new LiveReport({
        title,
        description,
        date
    });
    try {
        const newLiveReport = await liveReport.save();
        res.status(201).json(newLiveReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a live report
exports.updateLiveReport = async (req, res) => {
    try {
        const liveReport = await LiveReport.findById(req.params.id);
        if (!liveReport) {
            return res.status(404).json({ message: 'Live report not found' });
        }
        liveReport.title = req.body.title || liveReport.title;
        liveReport.description = req.body.description || liveReport.description;
        liveReport.date = req.body.date || liveReport.date;
        const updatedLiveReport = await liveReport.save();
        res.json(updatedLiveReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a live report
exports.deleteLiveReport = async (req, res) => {
    try {
        const liveReport = await LiveReport.findById(req.params.id);
        if (!liveReport) {
            return res.status(404).json({ message: 'Live report not found' });
        }
        await liveReport.remove();
        res.json({ message: 'Live report deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
