const prisma = require('../config/prisma');

const studentController = {
  getAllStudents: async (req, res) => {
    try {
      const students = await prisma.student.findMany({
        include: {
          classroom: {
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
          }
          ,
          parent: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (error) {
      console.error('Get all students error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil data siswa' 
      });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID tidak valid' 
        });
      }

      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          classroom: {
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
          }
          ,
          parent: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!student) {
        return res.status(404).json({ 
          success: false, 
          message: 'Siswa tidak ditemukan' 
        });
      }

      res.status(200).json({ 
        success: true, 
        data: student 
      });
    } catch (error) {
      console.error('Get student by id error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil data siswa' 
      });
    }
  },

  createStudent: async (req, res) => {
    try {
      const { name, gender, address, birthDate, classroomId, isActive, parentId } = req.body;

      if (!name || !gender || !birthDate || !classroomId || !parentId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name, gender, birthDate, classroom, dan parent wajib diisi' 
        });
      }

      const validGenders = ['MALE', 'FEMALE'];
      if (!validGenders.includes(gender)) {
        return res.status(400).json({ 
          success: false, 
          message: `Gender harus salah satu dari: ${validGenders.join(', ')}` 
        });
      }

      if (!classroomId || classroomId.length !== 24) {
        return res.status(400).json({ 
          success: false, 
          message: 'Classroom ID tidak valid' 
        });
      }

      const classroom = await prisma.classroom.findUnique({ where: { id: classroomId } });

      if (!classroom) {
        return res.status(404).json({ 
          success: false, 
          message: 'Kelas tidak ditemukan' 
        });
      }

      const createData = {
        name,
        gender,
        birthDate: new Date(birthDate),
        classroomId,
        address: address || null,
        parentId,
        isActive: typeof isActive === 'boolean' ? isActive : true,
        activityIds: []
      };

      if (parentId !== undefined && parentId !== null && parentId !== '') {
        if (typeof parentId !== 'string' || parentId.length !== 24) {
          return res.status(400).json({ success: false, message: 'Parent ID tidak valid' });
        }

        const parent = await prisma.user.findUnique({ where: { id: parentId } });
        if (!parent) {
          return res.status(404).json({ success: false, message: 'Orang tua (parent) tidak ditemukan' });
        }

        createData.parentId = parentId;
      }

      const student = await prisma.student.create({
        data: createData,
        include: {
          parent: { select: { id: true, name: true, email: true } }
        }
      });

      res.status(201).json({ 
        success: true, 
        message: 'Siswa berhasil dibuat', 
        data: student 
      });
    } catch (error) {
      console.error('Create student error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Gagal membuat data siswa' 
      });
    }
  },

  updateStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, gender, address, birthDate, classroomId, isActive, activityIds, parentId } = req.body;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID tidak valid' 
        });
      }

      const existing = await prisma.student.findUnique({ 
        where: { id } 
      });

      if (!existing) {
        return res.status(404).json({ 
          success: false, 
          message: 'Siswa tidak ditemukan' 
        });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (gender !== undefined) {
        const validGenders = ['MALE', 'FEMALE'];
        if (!validGenders.includes(gender)) {
          return res.status(400).json({ 
            success: false, 
            message: `Gender harus salah satu dari: ${validGenders.join(', ')}` 
          });
        }
        updateData.gender = gender;
      }
      if (address !== undefined) updateData.address = address;
      if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
      if (isActive !== undefined) updateData.isActive = isActive;
      if (activityIds !== undefined) {
        if (!Array.isArray(activityIds)) {
          return res.status(400).json({ 
            success: false, 
            message: 'activityIds harus berupa array' 
          });
        }
        updateData.activityIds = activityIds;
      }
      if (parentId !== undefined) {
        if (parentId && parentId.length !== 24) {
          return res.status(400).json({ success: false, message: 'Parent ID tidak valid' });
        }

        if (parentId) {
          const parent = await prisma.user.findUnique({ where: { id: parentId } });
          if (!parent) {
            return res.status(404).json({ success: false, message: 'Orang tua (parent) tidak ditemukan' });
          }
          updateData.parentId = parentId;
        } else {
          updateData.parentId = null;
        }
      }
      if (classroomId !== undefined) {
        if (!classroomId || classroomId.length !== 24) {
          return res.status(400).json({ 
            success: false, 
            message: 'Classroom ID tidak valid' 
          });
        }
        const classroom = await prisma.classroom.findUnique({ 
          where: { id: classroomId } 
        });
        if (!classroom) {
          return res.status(404).json({ 
            success: false, 
            message: 'Kelas tidak ditemukan' 
          });
        }
        updateData.classroomId = classroomId;
      }

      const updated = await prisma.student.update({
        where: { id },
        data: updateData,
        include: {
          classroom: { select: { id: true, name: true } },
          parent: { select: { id: true, name: true, email: true } }
        }
      });

      res.status(200).json({ 
        success: true, 
        message: 'Siswa berhasil diperbarui', 
        data: updated 
      });
    } catch (error) {
      console.error('Update student error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Gagal memperbarui data siswa' 
      });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID tidak valid' 
        });
      }

      const existing = await prisma.student.findUnique({ 
        where: { id } 
      });

      if (!existing) {
        return res.status(404).json({ 
          success: false, 
          message: 'Siswa tidak ditemukan' 
        });
      }

      await prisma.student.delete({ 
        where: { id } 
      });

      res.status(200).json({ 
        success: true, 
        message: 'Siswa berhasil dihapus' 
      });
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Gagal menghapus data siswa' 
      });
    }
  }
};

module.exports = studentController;