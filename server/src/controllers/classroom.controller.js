const prisma = require('../config/prisma');

const classroomController = {

  // Get all classrooms
  getAllClassrooms: async (req, res) => {
    try {
      const classrooms = await prisma.classroom.findMany({
        include: {
          students: {
            select: {
              id: true,
              name: true,
              gender: true,
              isActive: true
            }
          },
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
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        message: "Daftar kelas berhasil diambil",
        count: classrooms.length,
        data: classrooms
      });
    } catch (error) {
      console.error('Get classrooms error:', error);
      res.status(500).json({ 
        success: false,
        message: "Gagal mengambil data kelas"
      });
    }
  },

  // Get classroom by ID
  getClassroomById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const classroom = await prisma.classroom.findUnique({
        where: { id },
        include: {
          students: {
            select: {
              id: true,
              name: true,
              gender: true,
              birthDate: true,
              address: true,
              isActive: true
            },
            orderBy: {
              name: 'asc'
            }
          },
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
              date: true
            },
            orderBy: {
              date: 'desc'
            }
          },
          _count: {
            select: {
              students: true,
              activities: true
            }
          }
        }
      });

      if (!classroom) {
        return res.status(404).json({ 
          success: false,
          message: "Kelas tidak ditemukan" 
        });
      }

      res.status(200).json({
        success: true,
        message: "Detail kelas berhasil ditemukan",
        data: classroom
      });
    } catch (error) {
      console.error('Get classroom error:', error);
      res.status(500).json({ 
        success: false,
        message: "Gagal mengambil data kelas"
      });
    }
  },

  // Create classroom
  createClassroom: async (req, res) => {
    try {
      const { name, teacher, activityIds } = req.body;

      // Validate required fields
      if (!name || !teacher) {
        return res.status(400).json({
          success: false,
          message: "Nama kelas dan guru wajib diisi"
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

      // Check if classroom name already exists
      const existingClassroom = await prisma.classroom.findFirst({
        where: { name }
      });

      if (existingClassroom) {
        return res.status(400).json({
          success: false,
          message: "Nama kelas sudah digunakan"
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

      const classroom = await prisma.classroom.create({
        data: {
          name,
          teacherId: teacher,
          activityIds: activityIds || []
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
          }
        }
      });

      res.status(201).json({
        success: true,
        message: "Kelas berhasil dibuat",
        data: classroom
      });
    } catch (error) {
      console.error('Create classroom error:', error);
      res.status(400).json({ 
        success: false,
        message: "Gagal membuat kelas"
      });
    }
  },

  // Update classroom
  updateClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, teacher, activityIds } = req.body;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      // Check if classroom exists
      const existing = await prisma.classroom.findUnique({
        where: { id }
      });

      if (!existing) {
        return res.status(404).json({ 
          success: false,
          message: "Kelas tidak ditemukan" 
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

      // Check if name is unique (if changed)
      if (name && name !== existing.name) {
        const nameExists = await prisma.classroom.findFirst({
          where: { 
            name,
            id: { not: id }
          }
        });

        if (nameExists) {
          return res.status(400).json({
            success: false,
            message: "Nama kelas sudah digunakan"
          });
        }
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

      // Build update data
      const updateData = {};
      if (name) updateData.name = name;
      if (teacher) updateData.teacherId = teacher;
      if (activityIds) updateData.activityIds = activityIds;

      const updatedClassroom = await prisma.classroom.update({
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
          }
        }
      });

      res.status(200).json({
        success: true,
        message: "Kelas berhasil diperbarui",
        data: updatedClassroom
      });
    } catch (error) {
      console.error('Update classroom error:', error);
      res.status(400).json({ 
        success: false,
        message: "Gagal memperbarui kelas"
      });
    }
  },

  // Delete classroom
  deleteClassroom: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      // Check if classroom exists
      const classroom = await prisma.classroom.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              students: true
            }
          }
        }
      });

      if (!classroom) {
        return res.status(404).json({ 
          success: false,
          message: "Kelas tidak ditemukan" 
        });
      }

      await prisma.classroom.delete({
        where: { id }
      });

      res.status(200).json({ 
        success: true,
        message: "Kelas berhasil dihapus" 
      });
    } catch (error) {
      console.error('Delete classroom error:', error);
      res.status(500).json({ 
        success: false,
        message: "Gagal menghapus kelas"
      });
    }
  }
};

module.exports = classroomController;
