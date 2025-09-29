const Announcement = require('../models/Announcement');

const announcementController = {

  getAnnouncements: async (req, res) => {
    try {
      const announcements = await Announcement.find()
        .populate("createdBy", "name role");
      res.status(200).json(announcements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAnnouncementById: async (req, res) => {
    try {
      const announcement = await Announcement.findById(req.params.id)
        .populate("createdBy", "name role");
      if (!announcement) return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
      res.status(200).json(announcement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createAnnouncement: async (req, res) => {
    try {
      const announcement = new Announcement({
        title: req.body.title,
        content: req.body.content,
        isImportant: req.body.isImportant || false,
        createdBy: req.user._id
      });

      const newAnnouncement = await announcement.save();
      res.status(201).json(newAnnouncement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateAnnouncement: async (req, res) => {
    try {
      const updated = await Announcement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteAnnouncement: async (req, res) => {
    try {
      const deleted = await Announcement.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Pengumuman tidak ditemukan" });
      res.status(200).json({ message: "Pengumuman berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = announcementController;