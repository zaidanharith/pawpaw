const prisma = require('../config/prisma');

const attendanceController = {

  createAttendance: async (req, res) => {
    try {
      const { student, status, notes } = req.body;

      if (!student || !status) {
        return res.status(400).json({
          success: false,
          message: "Student dan status wajib diisi"
        });
      }

      if (!student || student.length !== 24) {
        return res.status(400).json({
          success: false,
          message: "Student ID tidak valid"
        });
      }

      const validStatus = ['HADIR', 'ALFA', 'SAKIT', 'IZIN'];
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status harus salah satu dari: ${validStatus.join(', ')}`
        });
      }

      const studentExists = await prisma.student.findUnique({
        where: { id: student }
      });

      if (!studentExists) {
        return res.status(404).json({
          success: false,
          message: "Siswa tidak ditemukan"
        });
      }

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User tidak ditemukan"
        });
      }

      const attendance = await prisma.attendance.create({
        data: {
          studentId: student,
          status,
          notes: notes || null,
          createdBy: req.user.id,
          date: new Date()
        },
        include: {
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
          },
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
        message: "Data kehadiran berhasil dibuat",
        data: attendance
      });
    } catch (error) {
      console.error('Create attendance error:', error);
      res.status(400).json({ 
        success: false,
        message: "Gagal membuat data kehadiran"
      });
    }
  },

  getAllAttendances: async (req, res) => {
    try {
      const attendances = await prisma.attendance.findMany({
        include: {
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
          },
          creator: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        message: "Daftar kehadiran berhasil diambil",
        count: attendances.length,
        data: attendances
      });
    } catch (error) {
      console.error('Get attendances error:', error);
      res.status(500).json({ 
        success: false,
        message: "Gagal mengambil data kehadiran"
      });
    }
  },

  getAttendanceById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const attendance = await prisma.attendance.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              gender: true,
              birthDate: true,
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
            }
          },
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

      if (!attendance) {
        return res.status(404).json({ 
          success: false,
          message: 'Data kehadiran tidak ditemukan' 
        });
      }

      res.status(200).json({
        success: true,
        message: "Data kehadiran berhasil ditemukan",
        data: attendance
      });
    } catch (error) {
      console.error('Get attendance error:', error);
      res.status(500).json({ 
        success: false,
        message: "Gagal mengambil data kehadiran"
      });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes, date } = req.body;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const existing = await prisma.attendance.findUnique({
        where: { id }
      });

      if (!existing) {
        return res.status(404).json({ 
          success: false,
          message: 'Data kehadiran tidak ditemukan' 
        });
      }

      if (status) {
        const validStatus = ['HADIR', 'ALFA', 'SAKIT', 'IZIN'];
        if (!validStatus.includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Status harus salah satu dari: ${validStatus.join(', ')}`
          });
        }
      }

      const updateData = {};
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes || null;
      if (date) updateData.date = new Date(date);

      const updated = await prisma.attendance.update({
        where: { id },
        data: updateData,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              gender: true
            }
          },
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
        message: "Data kehadiran berhasil diperbarui",
        data: updated
      });
    } catch (error) {
      console.error('Update attendance error:', error);
      res.status(400).json({ 
        success: false,
        message: "Gagal memperbarui data kehadiran"
      });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const attendance = await prisma.attendance.findUnique({
        where: { id }
      });

      if (!attendance) {
        return res.status(404).json({ 
          success: false,
          message: 'Data kehadiran tidak ditemukan' 
        });
      }

      await prisma.attendance.delete({
        where: { id }
      });

      res.status(200).json({ 
        success: true,
        message: 'Data kehadiran berhasil dihapus' 
      });
    } catch (error) {
      console.error('Delete attendance error:', error);
      res.status(500).json({ 
        success: false,
        message: "Gagal menghapus data kehadiran"
      });
    }
  },

  getAttendanceByStudent: async (req, res) => {
    try {
      const { studentId } = req.params;

      if (!studentId || studentId.length !== 24) {
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

      const attendances = await prisma.attendance.findMany({
        where: { studentId },
        include: {
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
          },
          creator: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      const stats = {
        total: attendances.length,
        hadir: attendances.filter(a => a.status === 'HADIR').length,
        alfa: attendances.filter(a => a.status === 'ALFA').length,
        sakit: attendances.filter(a => a.status === 'SAKIT').length,
        izin: attendances.filter(a => a.status === 'IZIN').length
      };

      res.status(200).json({
        success: true,
        message: "Data kehadiran siswa berhasil ditemukan",
        stats,
        data: attendances
      });
    } catch (error) {
      console.error('Get attendance by student error:', error);
      res.status(500).json({ 
        success: false,
        message: "Gagal mengambil data kehadiran siswa"
      });
    }
  }
};

module.exports = attendanceController;
