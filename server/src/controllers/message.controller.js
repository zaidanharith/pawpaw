const prisma = require('../config/prisma');

const messageController = {
  getUserMessages: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      // Check if otherId query param exists (for chat history between 2 users)
      const { otherId } = req.query;

      let whereClause;
      if (otherId) {
        // Get messages between current user and specific other user
        whereClause = {
          OR: [
            { senderId: userId, receiverId: otherId },
            { senderId: otherId, receiverId: userId }
          ]
        };
      } else {
        // Get all messages for current user
        whereClause = {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        };
      }

      const messages = await prisma.message.findMany({
        where: whereClause,
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
          student: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'asc' } // Changed to 'asc' for chat history
      });

      console.log(`📬 Fetched ${messages.length} messages for user ${userId}${otherId ? ` with ${otherId}` : ''}`);

      res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
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
      console.error('Error fetching message by ID:', error);
      res.status(500).json({ success: false, message: 'Gagal mengambil data pesan', error: error.message });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { receiverId, body, title } = req.body;
      const senderId = req.user?.id;

      if (!receiverId || !body) {
        return res.status(400).json({ success: false, message: 'receiverId dan body wajib diisi' });
      }
      if (!senderId) return res.status(401).json({ success: false, message: 'Unauthorized' });
      if (receiverId.length !== 24) return res.status(400).json({ success: false, message: 'receiverId tidak valid' });

      console.log(`📤 Creating message from ${senderId} to ${receiverId}`);

      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          title: title || 'Chat',
          body,
          isRead: false
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
          student: { select: { id: true, name: true } }
        }
      });

      console.log(`✅ Message created: ${newMessage.id}`);

      res.status(201).json({ success: true, message: 'Pesan berhasil dikirim', data: newMessage });
    } catch (error) {
      console.error('❌ Error sending message:', error);
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

      console.log(`✅ Message ${id} marked as read by ${userId}`);

      res.status(200).json({ success: true, message: 'Pesan ditandai sebagai dibaca', data: updatedMessage });
    } catch (error) {
      console.error('Error marking message as read:', error);
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

      console.log(`✏️ Updating message ${id} by user ${userId}`);

      const updated = await prisma.message.update({
        where: { id },
        data: { body },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
          student: { select: { id: true, name: true } }
        }
      });

      console.log(`✅ Message ${id} updated`);

      res.status(200).json({ success: true, message: 'Pesan berhasil diperbarui', data: updated });
    } catch (error) {
      console.error('❌ Error updating message:', error);
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

      console.log(`🗑️ Deleting message ${id} by user ${userId}`);

      await prisma.message.delete({ where: { id } });

      console.log(`✅ Message ${id} deleted`);

      res.status(200).json({ success: true, message: 'Pesan berhasil dihapus' });
    } catch (error) {
      console.error('❌ Error deleting message:', error);
      res.status(500).json({ success: false, message: 'Gagal menghapus pesan', error: error.message });
    }
  }
};

module.exports = messageController;