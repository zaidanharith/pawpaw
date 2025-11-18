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
      const { receiverId, body } = req.body;
      const senderId = req.user?.id;

      if (!receiverId || !body) {
        return res.status(400).json({ success: false, message: 'receiverId dan body wajib diisi' });
      }
      if (!senderId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      if (receiverId.length !== 24) return res.status(400).json({ success: false, message: 'receiverId tidak valid' });

      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          body,
          isRead: false
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
          student: { select: { id: true, name: true } }
        }
      });

      try {
        const io = req.app.get('io');
        if (io) {
          io.to(`user:${receiverId}`).emit('message:received', newMessage);
          io.to(`user:${senderId}`).emit('message:sent', newMessage);
        }
      } catch (emitErr) {
        console.error('Socket emit failed', emitErr);
      }

      res.status(201).json({ success: true, message: 'Pesan berhasil dikirim', data: newMessage });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Gagal mengirim pesan', error: error.message });
    }
  },

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

  updateMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req.body;
      const userId = req.user?.id;
      if (!id || id.length !== 24) return res.status(400).json({ success: false, message: 'ID tidak valid' });
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      if (!body) return res.status(400).json({ success: false, message: 'Body tidak boleh kosong' });

      const message = await prisma.message.findUnique({ where: { id } });
      if (!message) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan' });
      if (message.senderId !== userId) return res.status(403).json({ success: false, message: 'Hanya pengirim yang dapat mengubah pesan' });

      const updated = await prisma.message.update({
        where: { id },
        data: { body },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
          student: { select: { id: true, name: true } }
        }
      });

      try {
        const io = req.app.get('io');
        if (io) {
          io.to(`user:${updated.receiverId}`).emit('message:updated', updated);
          io.to(`user:${updated.senderId}`).emit('message:updated', updated);
        }
      } catch (emitErr) {
        console.error('Socket emit failed (update)', emitErr);
      }

      res.status(200).json({ success: true, message: 'Pesan berhasil diperbarui', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal memperbarui pesan', error: error.message });
    }
  },

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

      const deleted = await prisma.message.delete({ where: { id } });

      try {
        const io = req.app.get('io');
        if (io) {
          io.to(`user:${deleted.receiverId}`).emit('message:deleted', { id: deleted.id, senderId: deleted.senderId, receiverId: deleted.receiverId });
          io.to(`user:${deleted.senderId}`).emit('message:deleted', { id: deleted.id, senderId: deleted.senderId, receiverId: deleted.receiverId });
        }
      } catch (emitErr) {
        console.error('Socket emit failed (delete)', emitErr);
      }

      res.status(200).json({ success: true, message: 'Pesan berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal menghapus pesan', error: error.message });
    }
  }
};

module.exports = messageController;