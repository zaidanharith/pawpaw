const prisma = require('../config/prisma');

const activityController = {

  getAllActivities: async (req, res) => {
    try {
      const activities = await prisma.activity.findMany({
        include: {
          students: {
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
          },
          classrooms: {
            select: {
              id: true,
              name: true,
              teacher: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          liveReports: {
            select: {
              id: true,
              title: true,
              date: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        count: activities.length,
        data: activities
      });
    } catch (error) {
      console.error('Get activities error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil data aktivitas'
      });
    }
  },

  getActivityById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: 'ID tidak valid'
        });
      }

      const activity = await prisma.activity.findUnique({
        where: { id },
        include: {
          students: {
            select: {
              id: true,
              name: true,
              gender: true,
              birthDate: true,
              classroom: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          classrooms: {
            select: {
              id: true,
              name: true,
              teacher: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          liveReports: {
            select: {
              id: true,
              title: true,
              date: true,
              description: true,
              teacher: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (!activity) {
        return res.status(404).json({ 
          success: false,
          message: 'Aktivitas tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        data: activity
      });

    } catch (error) {
      console.error('Get activity error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal mengambil data aktivitas'
      });
    }
  },

  createActivity: async (req, res) => {
    try {
      const { name, description, studentIds, classroomIds, date } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama aktivitas wajib diisi'
        });
      }

      const validActivities = ['SENAM', 'BERMAIN', 'BERCERITA', 'MAKAN_SIANG'];
      if (!validActivities.includes(name)) {
        return res.status(400).json({
          success: false,
          message: `Nama aktivitas harus salah satu dari: ${validActivities.join(', ')}`
        });
      }

      if (studentIds && studentIds.length > 0) {
        const invalidIds = studentIds.filter(id => !id || id.length !== 24);
        if (invalidIds.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Format ID siswa tidak valid'
          });
        }
      }

      if (classroomIds && classroomIds.length > 0) {
        const invalidIds = classroomIds.filter(id => !id || id.length !== 24);
        if (invalidIds.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Format ID kelas tidak valid'
          });
        }
      }

      const activity = await prisma.activity.create({
        data: {
          name,
          description: description || null,
          date: date ? new Date(date) : new Date(),
          studentIds: studentIds || [],
          classroomIds: classroomIds || []
        },
        include: {
          students: {
            select: {
              id: true,
              name: true,
              gender: true
            }
          },
          classrooms: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Aktivitas berhasil dibuat',
        data: activity
      });
    } catch (error) {
      console.error('Create activity error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Gagal membuat aktivitas'
      });
    }
  },

  updateActivity: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, studentIds, classroomIds, date } = req.body;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: 'ID tidak valid'
        });
      }

      const existingActivity = await prisma.activity.findUnique({
        where: { id }
      });

      if (!existingActivity) {
        return res.status(404).json({ 
          success: false,
          message: 'Aktivitas tidak ditemukan'
        });
      }

      if (name) {
        const validActivities = ['SENAM', 'BERMAIN', 'BERCERITA', 'MAKAN_SIANG'];
        if (!validActivities.includes(name)) {
          return res.status(400).json({
            success: false,
            message: `Nama aktivitas harus salah satu dari: ${validActivities.join(', ')}`
          });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (date) updateData.date = new Date(date);
      if (studentIds) updateData.studentIds = studentIds;
      if (classroomIds) updateData.classroomIds = classroomIds;

      const updated = await prisma.activity.update({
        where: { id },
        data: updateData,
        include: {
          students: {
            select: {
              id: true,
              name: true,
              gender: true
            }
          },
          classrooms: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Aktivitas berhasil diperbarui',
        data: updated
      });
    } catch (error) {
      console.error('Update activity error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Gagal memperbarui aktivitas'
      });
    }
  },

  deleteActivity: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: 'ID tidak valid'
        });
      }

      const activity = await prisma.activity.findUnique({
        where: { id }
      });

      if (!activity) {
        return res.status(404).json({ 
          success: false,
          message: 'Aktivitas tidak ditemukan'
        });
      }

      await prisma.activity.delete({
        where: { id }
      });

      res.status(200).json({ 
        success: true,
        message: 'Aktivitas berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete activity error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Gagal menghapus aktivitas'
      });
    }
  }
};

module.exports = activityController;