const mongoose = require("mongoose");
const Activity = require('../models/Activity');

const activityController = {

  getAllActivities: async (req, res) => {
    try {
      const activities = await Activity.find()
        .populate("student", "name gender classroom");
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getActivityById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }
      
      const activity = await Activity.findById(req.params.id)
        .populate("student", "name gender classroom");

      if (!activity) return res.status(404).json({ message: "Aktivitas tidak ditemukan" });
      res.status(200).json(activity);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createActivity: async (req, res) => {
    try {
      const activity = new Activity({
        name: req.body.name,
        description: req.body.description,
        student: req.body.student
      });

      const newActivity = await activity.save();
      res.status(201).json(newActivity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateActivity: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const updated = await Activity.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updated) return res.status(404).json({ message: "Aktivitas tidak ditemukan" });
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteActivity: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const deleted = await Activity.findByIdAndDelete(req.params.id);
      
      if (!deleted) return res.status(404).json({ message: "Aktivitas tidak ditemukan" });
      res.status(200).json({ message: "Aktivitas berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = activityController;