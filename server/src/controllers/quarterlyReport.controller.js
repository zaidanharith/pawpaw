const prisma = require('../config/prisma');

const getQuarter = (month) => {
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
};

const quarterlyReportController = {

  generateQuarterlyReport: async (req, res) => {
    try {
      const { studentId, teacherId } = req.body;

      if (!studentId || !teacherId) {
        return res.status(400).json({
          success: false,
          message: "Student ID dan Teacher ID wajib diisi"
        });
      }

      if (!studentId || studentId.length !== 24) {
        return res.status(400).json({
          success: false,
          message: "Student ID tidak valid"
        });
      }

      if (!teacherId || teacherId.length !== 24) {
        return res.status(400).json({
          success: false,
          message: "Teacher ID tidak valid"
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

      const teacher = await prisma.user.findUnique({
        where: { id: teacherId }
      });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Guru tidak ditemukan"
        });
      }

      if (teacher.role !== 'TEACHER' && teacher.role !== 'ADMIN') {
        return res.status(400).json({
          success: false,
          message: "User bukan guru"
        });
      }

      const now = new Date();
      const quarter = getQuarter(now.getMonth());
      const year = now.getFullYear();

      const existing = await prisma.quarterlyReport.findFirst({
        where: {
          studentId,
          quarter,
          year
        }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Laporan triwulan untuk ${quarter} ${year} sudah ada`
        });
      }

      const startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 3);

      const liveReports = await prisma.liveReport.findMany({
        where: {
          date: {
            gte: startDate,
            lte: now
          },
          activities: {
            some: {
              students: {
                some: {
                  id: studentId
                }
              }
            }
          }
        },
        include: {
          activities: {
            select: {
              name: true,
              description: true
            }
          }
        }
      });

      const activitiesSummary = liveReports.flatMap(report => 
        report.activities.map(activity => 
          `${activity.name}${activity.description ? `: ${activity.description}` : ''}`
        )
      );

      const uniqueActivities = [...new Set(activitiesSummary)];

      const newReport = await prisma.quarterlyReport.create({
        data: {
          studentId,
          teacherId,
          quarter,
          year,
          activitiesSummary: uniqueActivities,
          notes: `Rangkuman laporan untuk ${quarter} ${year}`,
          meetingReminder: true
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
        message: 'Laporan triwulan berhasil dibuat',
        data: newReport
      });
      
    } catch (error) {
      console.error('Generate quarterly report error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal membuat laporan triwulan'
      });
    }
  },

  getQuarterlyReports: async (req, res) => {
    try {
      const reports = await prisma.quarterlyReport.findMany({
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
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: [
          { year: 'desc' },
          { quarter: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
      console.error('Get quarterly reports error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil laporan triwulan'
      });
    }
  },

  getQuarterlyReportById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const report = await prisma.quarterlyReport.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              gender: true,
              birthDate: true,
              address: true,
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
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              role: true
            }
          }
        }
      });

      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Laporan triwulan tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Get quarterly report error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil laporan triwulan'
      });
    }
  },

  getQuarterlyReportsByStudent: async (req, res) => {
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

      const reports = await prisma.quarterlyReport.findMany({
        where: { studentId },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: [
          { year: 'desc' },
          { quarter: 'desc' }
        ]
      });

      res.status(200).json({
        success: true,
        count: reports.length,
        student: {
          id: student.id,
          name: student.name
        },
        data: reports
      });
    } catch (error) {
      console.error('Get quarterly reports by student error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil laporan siswa'
      });
    }
  },

  updateQuarterlyReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { notes, meetingReminder, activitiesSummary } = req.body;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const existing = await prisma.quarterlyReport.findUnique({
        where: { id }
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Laporan triwulan tidak ditemukan'
        });
      }

      const updateData = {};
      if (notes !== undefined) updateData.notes = notes;
      if (meetingReminder !== undefined) updateData.meetingReminder = meetingReminder;
      if (activitiesSummary) updateData.activitiesSummary = activitiesSummary;

      const updatedReport = await prisma.quarterlyReport.update({
        where: { id },
        data: updateData,
        include: {
          student: {
            select: {
              id: true,
              name: true
            }
          },
          teacher: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Laporan triwulan berhasil diperbarui',
        data: updatedReport
      });
    } catch (error) {
      console.error('Update quarterly report error:', error);
      res.status(400).json({
        success: false,
        message: 'Gagal memperbarui laporan triwulan'
      });
    }
  },

  deleteQuarterlyReport: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ 
          success: false,
          message: "ID tidak valid" 
        });
      }

      const report = await prisma.quarterlyReport.findUnique({
        where: { id }
      });

      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Laporan triwulan tidak ditemukan'
        });
      }

      await prisma.quarterlyReport.delete({
        where: { id }
      });

      res.status(200).json({
        success: true,
        message: 'Laporan triwulan berhasil dihapus'
      });
    } catch (error) {
      console.error('Delete quarterly report error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus laporan triwulan'
      });
    }
  }
};

module.exports = quarterlyReportController;