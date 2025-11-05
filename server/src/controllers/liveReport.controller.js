const prisma = require('../config/prisma');
const uploadController = require('./upload.controller');

const liveReportController = {
  // Get all live reports
  getAllLiveReports: async (req, res) => {
    try {
      const liveReports = await prisma.liveReport.findMany({
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          activities: {
            select: {
              id: true,
              name: true,
              description: true,
              date: true
            }
          },
          photos: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              path: true,
              size: true,
              mimeType: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        count: liveReports.length,
        data: liveReports
      });
    } catch (error) {
      console.error('Get live reports error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil data laporan langsung'
      });
    }
  },

  // Get live report by ID
  getLiveReportById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const liveReport = await prisma.liveReport.findUnique({
        where: { id },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              role: true
            }
          },
          activities: {
            select: {
              id: true,
              name: true,
              description: true,
              date: true,
              students: {
                select: {
                  id: true,
                  name: true,
                  gender: true
                }
              }
            }
          },
          photos: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              path: true,
              size: true,
              mimeType: true,
              createdAt: true
            }
          }
        }
      });

      if (!liveReport) {
        return res.status(404).json({ 
          success: false,
          message: 'Laporan langsung tidak ditemukan' 
        });
      }

      res.status(200).json({
        success: true,
        data: liveReport
      });
    } catch (error) {
      console.error('Get live report error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil data laporan langsung'
      });
    }
  },

  // Create live report
  createLiveReport: async (req, res) => {
    try {
      const { title, description, date, teacher, activityIds } = req.body;

      // Validate required fields
      if (!title || !date || !teacher) {
        return res.status(400).json({
          success: false,
          message: "Title, date, dan teacher wajib diisi"
        });
      }

      // Validate teacher ID
      if (!teacher || teacher.length !== 24) {
        return res.status(400).json({
          success: false,
          message: "Teacher ID tidak valid"
        });
      }

      // Check if teacher exists
      const teacherExists = await prisma.user.findUnique({
        where: { id: teacher }
      });

      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          message: "Guru tidak ditemukan"
        });
      }

      // Validate teacher role
      if (teacherExists.role !== 'TEACHER' && teacherExists.role !== 'ADMIN') {
        return res.status(400).json({
          success: false,
          message: "User bukan guru"
        });
      }

      // Validate activityIds if provided
      if (activityIds && activityIds.length > 0) {
        const invalidIds = activityIds.filter(id => !id || id.length !== 24);
        if (invalidIds.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Format Activity ID tidak valid"
          });
        }
      }

      // Handle file upload
      let uploadedPhotos = [];
      if (req.file) {
        const uploadedFile = await uploadController._saveFile(req.file);
        uploadedPhotos = [uploadedFile.id];
      } else if (req.files && req.files.length > 0) {
        // Multiple files
        for (const file of req.files) {
          const uploadedFile = await uploadController._saveFile(file);
          uploadedPhotos.push(uploadedFile.id);
        }
      }

      const liveReport = await prisma.liveReport.create({
        data: {
          title,
          description: description || null,
          date: new Date(date),
          teacherId: teacher,
          activityIds: activityIds || [],
          photos: uploadedPhotos.length > 0 
            ? {
                connect: uploadedPhotos.map(id => ({ id }))
              }
            : undefined
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          activities: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
          photos: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              path: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: "Laporan langsung berhasil dibuat",
        data: liveReport
      });
    } catch (error) {
      console.error('Create live report error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Gagal membuat laporan langsung'
      });
    }
  },

  // Update live report
  updateLiveReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, date, teacher, activityIds } = req.body;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      // Check if live report exists
      const existing = await prisma.liveReport.findUnique({
        where: { id },
        include: {
          photos: true
        }
      });

      if (!existing) {
        return res.status(404).json({ 
          success: false,
          message: 'Laporan langsung tidak ditemukan' 
        });
      }

      // Validate teacher if provided
      if (teacher) {
        if (teacher.length !== 24) {
          return res.status(400).json({
            success: false,
            message: "Teacher ID tidak valid"
          });
        }

        const teacherExists = await prisma.user.findUnique({
          where: { id: teacher }
        });

        if (!teacherExists) {
          return res.status(404).json({
            success: false,
            message: "Guru tidak ditemukan"
          });
        }

        if (teacherExists.role !== 'TEACHER' && teacherExists.role !== 'ADMIN') {
          return res.status(400).json({
            success: false,
            message: "User bukan guru"
          });
        }
      }

      // Build update data
      const updateData = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (date) updateData.date = new Date(date);
      if (teacher) updateData.teacherId = teacher;
      if (activityIds) updateData.activityIds = activityIds;

      // Handle new photo upload
      if (req.file) {
        const uploadedFile = await uploadController._saveFile(req.file);
        
        // Update photo relation
        updateData.photos = {
          connect: { id: uploadedFile.id }
        };
      } else if (req.files && req.files.length > 0) {
        // Multiple files
        const uploadedPhotos = [];
        for (const file of req.files) {
          const uploadedFile = await uploadController._saveFile(file);
          uploadedPhotos.push({ id: uploadedFile.id });
        }
        
        updateData.photos = {
          connect: uploadedPhotos
        };
      }

      const updatedLiveReport = await prisma.liveReport.update({
        where: { id },
        data: updateData,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          activities: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
          photos: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              path: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: "Laporan langsung berhasil diperbarui",
        data: updatedLiveReport
      });
    } catch (error) {
      console.error('Update live report error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Gagal memperbarui laporan langsung'
      });
    }
  },

  // Delete live report
  deleteLiveReport: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      // Check if live report exists
      const liveReport = await prisma.liveReport.findUnique({
        where: { id },
        include: {
          photos: true
        }
      });

      if (!liveReport) {
        return res.status(404).json({ 
          success: false,
          message: 'Laporan langsung tidak ditemukan' 
        });
      }

      // Delete live report (photos will be set to null via onDelete: SetNull)
      await prisma.liveReport.delete({
        where: { id }
      });

      res.status(200).json({ 
        success: true,
        message: 'Laporan langsung berhasil dihapus' 
      });
    } catch (error) {
      console.error('Delete live report error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal menghapus laporan langsung'
      });
    }
  }
};

module.exports = liveReportController;
