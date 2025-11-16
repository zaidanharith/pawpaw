const prisma = require('../config/prisma');

const messageController = {
  getUserMessages: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
          student: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengambil pesan', error: error.message });
    }
  },

  getMessageById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || id.length !== 24) return res.status(400).json({ success: false, message: 'ID tidak valid' });

      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const message = await prisma.message.findUnique({
        where: { id },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
          student: { select: { id: true, name: true } }
        }
      });

      if (!message) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
      if (message.senderId !== userId && message.receiverId !== userId)
        return res.status(403).json({ success: false, message: 'Tidak diizinkan mengakses pesan ini' });

      res.status(200).json({ success: true, data: message });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengambil data pesan', error: error.message });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { receiverId, body, title } = req.body;
      const senderId = req.user?.id;

      if (!receiverId || !body || !title) {
        return res.status(400).json({ success: false, message: 'receiverId, title, dan body wajib diisi' });
      }
      if (!senderId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      if (receiverId.length !== 24) return res.status(400).json({ success: false, message: 'receiverId tidak valid' });

      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          title,
          body,
          isRead: false
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
          student: { select: { id: true, name: true } }
        }
      });

      res.status(201).json({ success: true, message: 'Pesan berhasil dikirim', data: newMessage });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Gagal mengirim pesan', error: error.message });
    }
  },

  // Mark message as read
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!id || id.length !== 24) return res.status(400).json({ success: false, message: 'ID tidak valid' });
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const message = await prisma.message.findUnique({ where: { id } });
      if (!message) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
      if (message.receiverId !== userId)
        return res.status(403).json({ success: false, message: 'Hanya penerima yang dapat menandai pesan sebagai dibaca' });

      const updatedMessage = await prisma.message.update({
        where: { id },
        data: { isRead: true }
      });

      res.status(200).json({ success: true, message: 'Pesan ditandai sebagai dibaca', data: updatedMessage });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal menandai pesan sebagai dibaca', error: error.message });
    }
  },

  // Delete message
  deleteMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!id || id.length !== 24) return res.status(400).json({ success: false, message: 'ID tidak valid' });
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const message = await prisma.message.findUnique({ where: { id } });
      if (!message) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
      if (message.senderId !== userId && message.receiverId !== userId)
        return res.status(403).json({ success: false, message: 'Tidak diizinkan menghapus pesan ini' });

      await prisma.message.delete({ where: { id } });
      res.status(200).json({ success: true, message: 'Pesan berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal menghapus pesan', error: error.message });
    }
  }
};

module.exports = messageController;
