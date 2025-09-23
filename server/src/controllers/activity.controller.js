const Activity = require('../models/Activity');

// Get all activities
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get activity by ID
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json(activity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new activity
exports.createActivity = async (req, res) => {
    const { title, description, date } = req.body;
    const activity = new Activity({
        title,
        description,
        date
    });
    try {
        const newActivity = await activity.save();
        res.status(201).json(newActivity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update an activity
exports.updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        activity.title = req.body.title || activity.title;
        activity.description = req.body.description || activity.description;
        activity.date = req.body.date || activity.date;
        const updatedActivity = await activity.save();
        res.json(updatedActivity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        await activity.remove();
        res.json({ message: 'Activity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
