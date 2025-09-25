const Message = require('../models/message');

// GET all messages (hanya untuk user yg login)
exports.getUserMessages = async (req, res) => {
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
};

// GET message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender receiver', 'name username email');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // pastikan yg akses adalah pengirim/penerima
    if (
      message.sender.toString() !== req.user.userId &&
      message.receiver.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, title, body } = req.body;

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
};

// DELETE message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // hanya pengirim atau penerima yg bisa hapus
    if (
      message.sender.toString() !== req.user.userId &&
      message.receiver.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await message.deleteOne();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};