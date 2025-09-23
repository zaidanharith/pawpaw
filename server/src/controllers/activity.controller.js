const Activity = require('../models/Activity');

// Get all activities
exports.getAllActivity = async (req, res) => {
	try {
		res.status(200).json(activities);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Get activity by ID
exports.getActivityById = async (req, res) => {
	try {
		if (!activity) {
			return res.status(404).json({ error: 'Activity not found' });
		}
		res.status(200).json(activity);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Create a new activity
exports.createActivity = async (req, res) => {
	try {
		const newActivity = new Activity(req.body);
		const savedActivity = await newActivity.save();
		res.status(201).json(savedActivity);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Delete an activity by ID
exports.deleteActivity = async (req, res) => {
	try {
		const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
		if (!deletedActivity) {
			return res.status(404).json({ error: 'Activity not found' });
		}
		res.status(200).json({ message: 'Activity deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
