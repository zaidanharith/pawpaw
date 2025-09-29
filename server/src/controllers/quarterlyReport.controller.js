const QuarterlyReport = require('../models/QuarterlyReport');
const LiveReport = require('../models/LiveReport');

// Helper untuk tentukan quarter dari bulan
// Helper untuk tentukan quarter dari bulan (0 = Jan, 11 = Des)
const getQuarter = (month) => {
  if (month < 3) return 'Q1';   // Jan–Mar
  if (month < 6) return 'Q2';   // Apr–Jun
  if (month < 9) return 'Q3';   // Jul–Sep
  return 'Q4';                  // Oct–Dec
};

// Generate Quarterly Report
exports.generateQuarterlyReport = async (req, res) => {
  try {
    const { studentId, teacherId } = req.body;
    const now = new Date();
    const quarter = getQuarter(now.getMonth());
    const year = now.getFullYear();

    // Cek kalau sudah ada report untuk quarter ini
    const existing = await QuarterlyReport.findOne({ student: studentId, quarter, year });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Quarterly report for ${quarter} ${year} already exists`
      });
    }

    // Ambil live reports 3 bulan terakhir untuk siswa ini
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 3);

    const liveReports = await LiveReport.find({
      student: studentId,
      date: { $gte: startDate, $lte: now }
    }).populate('activity', 'title');

    // Buat summary aktivitas (support activity tunggal & array)
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
      notes: `Summary report for ${quarter} ${year}`,
      meetingReminder: true
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: 'Quarterly report generated successfully',
      data: newReport
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate quarterly report',
      error: err.message
    });
  }
};

// Get all reports
exports.getQuarterlyReports = async (req, res) => {
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
      message: 'Failed to fetch quarterly reports',
      error: err.message
    });
  }
};

// Get report by ID
exports.getQuarterlyReportById = async (req, res) => {
  try {
    const report = await QuarterlyReport.findById(req.params.id)
      .populate('student', 'name')
      .populate('teacher', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Quarterly report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: err.message
    });
  }
};

// Delete report
exports.deleteQuarterlyReport = async (req, res) => {
  try {
    const report = await QuarterlyReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Quarterly report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quarterly report deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: err.message
    });
  }
};