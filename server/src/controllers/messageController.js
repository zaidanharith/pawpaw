const Message = require('../models/Message');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to send message',
      error: err.message
    });
  }
};

// Get all messages (optional: filter by sender/receiver)
exports.getMessages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.sender) filter.sender = req.query.sender;
    if (req.query.receiver) filter.receiver = req.query.receiver;
    if (req.query.student) filter.student = req.query.student;

    const messages = await Message.find(filter)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('student', 'name');

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: err.message
    });
  }
};

// Get message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('student', 'name');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message',
      error: err.message
    });
  }
};

// Update message (e.g., edit title/body)
exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to update message',
      error: err.message
    });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark as read',
      error: err.message
    });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: err.message
    });
  }
};