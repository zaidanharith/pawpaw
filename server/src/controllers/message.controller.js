const mongoose = require("mongoose");
const Message = require('../models/message');

const messageController = {

  getUserMessages: async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user.userId },
          { receiver: req.user.userId }
        ]
      }).populate('sender receiver', 'name username email');

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMessageById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const message = await Message.findById(req.params.id)
        .populate('sender receiver', 'name username email');

      if (!message) {
        return res.status(404).json({ message: 'Pesan tidak ditemukan' });
      }

      if (
        message.sender._id.toString() !== req.user.userId &&
        message.receiver._id.toString() !== req.user.userId
      ) {
        return res.status(403).json({ message: 'Tidak diizinkan' });
      }

      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { sender, receiver, title, body } = req.body;

      const newMessage = await Message.create({
        sender: req.user.userId,
        receiver,
        title,
        body
      });

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const message = await Message.findById(req.params.id)
        .populate('sender receiver', 'name username email');

      if (!message) {
        return res.status(404).json({ message: 'Pesan tidak ditemukan' });
      }

      if (
        message.sender._id.toString() !== req.user.userId &&
        message.receiver._id.toString() !== req.user.userId
      ) {
        return res.status(403).json({ message: 'Tidak diizinkan' });
      }

      await message.deleteOne();
      res.status(200).json({ message: 'Pesan berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = messageController;
