const Activity = require('../models/Activity');

// Create activity
exports.createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to create activity',
      error: err.message
    });
  }
};

// Get all activities
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('student', 'name')   // populate student, ambil field "name"
      .populate('teacher', 'name'); // populate teacher, ambil field "name"
    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: err.message
    });
  }
};

// Get activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('student', 'name')
      .populate('teacher', 'name');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
      error: err.message
    });
  }
};

// Update activity
exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to update activity',
      error: err.message
    });
  }
};

// Delete activity
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
      error: err.message
    });
  }
};