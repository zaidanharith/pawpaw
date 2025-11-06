const prisma = require('../config/prisma');

const messageController = {

  getUserMessages: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: req.user.id },
            { receiverId: req.user.id }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              role: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              role: true
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              gender: true,
              classroom: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      console.error('Get user messages error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil pesan pengguna'
      });
    }
  },

  getMessageById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      const message = await prisma.message.findUnique({
        where: { id },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              role: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              role: true
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              gender: true,
              classroom: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      if (!message) {
        return res.status(404).json({ 
          success: false,
          message: 'Pesan tidak ditemukan' 
        });
      }

      if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'Tidak diizinkan mengakses pesan ini' 
        });
      }

      res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Get message error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil data pesan'
      });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { receiver, title, body, studentId } = req.body;

      if (!receiver || !title || !body) {
        return res.status(400).json({
          success: false,
          message: "Receiver, title, dan body wajib diisi"
        });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      if (!receiver || receiver.length !== 24) {
        return res.status(400).json({
          success: false,
          message: "Receiver ID tidak valid"
        });
      }

      const receiverUser = await prisma.user.findUnique({
        where: { id: receiver }
      });

      if (!receiverUser) {
        return res.status(404).json({
          success: false,
          message: "Penerima tidak ditemukan"
        });
      }

      if (studentId) {
        if (studentId.length !== 24) {
          return res.status(400).json({
            success: false,
            message: "Student ID tidak valid"
          });
        }

        const student = await prisma.student.findUnique({
          where: { id: studentId }
        });

        if (!student) {
          return res.status(404).json({
            success: false,
            message: "Siswa tidak ditemukan"
          });
        }
      }

      const newMessage = await prisma.message.create({
        data: {
          senderId: req.user.id,
          receiverId: receiver,
          title,
          body,
          studentId: studentId || null,
          isRead: false
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              role: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              role: true
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              gender: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: "Pesan berhasil dikirim",
        data: newMessage
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Gagal mengirim pesan'
      });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      const message = await prisma.message.findUnique({
        where: { id }
      });

      if (!message) {
        return res.status(404).json({ 
          success: false,
          message: 'Pesan tidak ditemukan' 
        });
      }

      if (message.receiverId !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'Hanya penerima yang dapat menandai pesan sebagai dibaca' 
        });
      }

      const updatedMessage = await prisma.message.update({
        where: { id },
        data: { isRead: true },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: "Pesan ditandai sebagai dibaca",
        data: updatedMessage
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal menandai pesan sebagai dibaca'
      });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      const message = await prisma.message.findUnique({
        where: { id }
      });

      if (!message) {
        return res.status(404).json({ 
          success: false,
          message: 'Pesan tidak ditemukan' 
        });
      }

      if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          message: 'Tidak diizinkan menghapus pesan ini' 
        });
      }

      await prisma.message.delete({
        where: { id }
      });

      res.status(200).json({ 
        success: true,
        message: 'Pesan berhasil dihapus' 
      });
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal menghapus pesan'
      });
    }
  },

  getInbox: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      const messages = await prisma.message.findMany({
        where: { receiverId: req.user.id },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              role: true
            }
          },
          student: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const unreadCount = messages.filter(msg => !msg.isRead).length;

      res.status(200).json({
        success: true,
        count: messages.length,
        unreadCount,
        data: messages
      });
    } catch (error) {
      console.error('Get inbox error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil kotak masuk'
      });
    }
  },

  getSentMessages: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User tidak ditemukan'
        });
      }

      const messages = await prisma.message.findMany({
        where: { senderId: req.user.id },
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              role: true
            }
          },
          student: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      console.error('Get sent messages error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil pesan terkirim'
      });
    }
  }
};

module.exports = messageController;
