const mongoose = require("mongoose");
const QuarterlyReport = require('../models/QuarterlyReport');
const LiveReport = require('../models/LiveReport');

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
      const now = new Date();
      const quarter = getQuarter(now.getMonth());
      const year = now.getFullYear();

      const existing = await QuarterlyReport.findOne({ student: studentId, quarter, year });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Laporan triwulan untuk ${quarter} ${year} sudah ada`
        });
      }

      const startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 3);

      const liveReports = await LiveReport.find({
        student: studentId,
        date: { $gte: startDate, $lte: now }
      }).populate('activity', 'title');

      const activitiesSummary = liveReports.flatMap(r => {
        if (Array.isArray(r.activity)) {
          return r.activity.map(a => a.title);
        } else if (r.activity) {
          return [r.activity.title];
        }
        return [];
      });

      const newReport = new QuarterlyReport({
        student: studentId,
        teacher: teacherId,
        quarter,
        year,
        activitiesSummary,
        notes: `Rangkuman laporan untuk ${quarter} ${year}`,
        meetingReminder: true
      });

      await newReport.save();

      res.status(201).json({
        success: true,
        message: 'Laporan triwulan berhasil dibuat',
        data: newReport
      });
      
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal membuat laporan triwulan',
        error: err.message
      });
    }
  },

  getQuarterlyReports: async (req, res) => {
    try {
      const reports = await QuarterlyReport.find()
        .populate('student', 'name')
        .populate('teacher', 'name email');

      res.status(200).json({
        success: true,
        data: reports
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil laporan triwulan',
        error: err.message
      });
    }
  },

  getQuarterlyReportById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID tidak valid" });
      }

      const report = await QuarterlyReport.findById(req.params.id)
        .populate('student', 'name')
        .populate('teacher', 'name email');

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
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil laporan',
        error: err.message
      });
    }
  },

  deleteQuarterlyReport: async (req, res) => {
    try {
      const report = await QuarterlyReport.findByIdAndDelete(req.params.id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Laporan triwulan tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Laporan triwulan berhasil dihapus'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus laporan',
        error: err.message
      });
    }
  }
};

module.exports = quarterlyReportController;