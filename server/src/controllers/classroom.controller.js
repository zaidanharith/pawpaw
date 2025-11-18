const prisma = require('../config/prisma');

const classroomController = {

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

  getClassroomById: async (req, res) => {
    try {
      const { id } = req.params;

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

  createClassroom: async (req, res) => {
    try {
      const { name, teacher } = req.body;
      console.log("Creating classroom with name:", name, "and teacher ID:", teacher);

      if (!name || !teacher) {
        return res.status(400).json({
          success: false,
          message: "Nama kelas dan guru wajib diisi"
        });
      }
      console.log("1");
      if (!teacher || teacher.length !== 24) {
        return res.status(400).json({
          success: false,
          message: "Teacher ID tidak valid"
        });
      }
      console.log("2");
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

      const existingClassroom = await prisma.classroom.findFirst({
        where: { name }
      });

      if (existingClassroom) {
        return res.status(400).json({
          success: false,
          message: "Nama kelas sudah digunakan"
        });
      }

      const classroom = await prisma.classroom.create({
        data: {
          name,
          teacherId: teacher
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
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

  updateClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, teacher } = req.body;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const existing = await prisma.classroom.findUnique({
        where: { id }
      });

      if (!existing) {
        return res.status(404).json({ 
          success: false,
          message: "Kelas tidak ditemukan" 
        });
      }

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

      const updateData = {};
      if (name) updateData.name = name;
      if (teacher) updateData.teacherId = teacher;

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

  deleteClassroom: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

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
