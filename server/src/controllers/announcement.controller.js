const prisma = require('../config/prisma');

const announcementController = {

  getAnnouncements: async (req, res) => {
    try {
      const announcements = await prisma.announcement.findMany({
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              role: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements
      });
    } catch (error) {
      console.error('Get announcements error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil data pengumuman'
      });
    }
  },

  getAnnouncementById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: 'ID tidak valid'
        });
      }

      const announcement = await prisma.announcement.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              role: true,
              email: true
            }
          }
        }
      });

      if (!announcement) {
        return res.status(404).json({ 
          success: false,
          message: 'Pengumuman tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        data: announcement
      });
    } catch (error) {
      console.error('Get announcement error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil data pengumuman'
      });
    }
  },

  createAnnouncement: async (req, res) => {
    try {
      const { title, content, isImportant } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Judul dan konten wajib diisi'
        });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Pengguna tidak ditemukan'
        });
      }

      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          isImportant: isImportant || false,
          createdBy: req.user.id
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Pengumuman berhasil dibuat',
        data: announcement
      });
    } catch (error) {
      console.error('Create announcement error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Gagal membuat pengumuman'
      });
    }
  },

  updateAnnouncement: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, isImportant } = req.body;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: 'ID tidak valid'
        });
      }

      const existing = await prisma.announcement.findUnique({
        where: { id }
      });

      if (!existing) {
        return res.status(404).json({ 
          success: false,
          message: 'Pengumuman tidak ditemukan'
        });
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (isImportant !== undefined) updateData.isImportant = isImportant;

      const updated = await prisma.announcement.update({
        where: { id },
        data: updateData,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Pengumuman berhasil diperbarui',
        data: updated
      });
    } catch (error) {
      console.error('Update announcement error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Gagal memperbarui pengumuman'
      });
    }
  },

  deleteAnnouncement: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: 'ID tidak valid'
        });
      }

      const announcement = await prisma.announcement.findUnique({
        where: { id }
      });

      if (!announcement) {
        return res.status(404).json({ 
          success: false,
          message: 'Pengumuman tidak ditemukan'
        });
      }

      await prisma.announcement.delete({
        where: { id }
      });

      res.status(200).json({ 
        success: true,
        message: 'Pengumuman berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete announcement error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal menghapus pengumuman'
      });
    }
  }
};

module.exports = announcementController;