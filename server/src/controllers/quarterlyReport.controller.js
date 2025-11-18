// controller/quarterlyReport.controller.js

const prisma = require('../config/prisma');
const PDFDocument = require('pdfkit');

// Helper
const getQuarter = (month) => {
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
};

const quarterlyReportController = {

  generateQuarterlyReport: async (req, res) => {
    try {
      const now = new Date();
      const quarter = getQuarter(now.getMonth());
      const year = now.getFullYear();

      const meetingDateStr = req.body.meetingDate;
      let meetingDate = null;

      if (meetingDateStr) {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(meetingDateStr);
        if (!m) {
          return res.status(400).json({
        success: false,
        message: "Format meetingDate harus yyyy-mm-dd (contoh: 2025-11-17)"
          });
        }
        const [, yy, mm, dd] = m;
        meetingDate = new Date(Number(yy), Number(mm) - 1, Number(dd));
      }

      req.body.meetingDate = meetingDate;

      const ninetyDaysAgo = new Date(now);
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const liveReports = await prisma.liveReport.findMany({
        where: {
          date: { gte: ninetyDaysAgo, lte: now }
        },
        orderBy: { date: "asc" }
      });

      const attendances = await prisma.attendance.findMany({
        where: {
          date: { gte: ninetyDaysAgo, lte: now }
        }
      });

      const newReport = await prisma.quarterlyReport.create({
        data: {
          quarter,
          year,
          title: req.body.title,
          meetingDate: meetingDate,
          liveReportIds: liveReports.map(a => a.id),
          attendanceIds: attendances.map(a => a.id)
        }
      });

      res.status(201).json({
        success: true,
        message: "Laporan triwulan berhasil dibuat",
        data: {
          report: newReport
        }
      });

    } catch (error) {
      console.error("Generate quarterly report error:", error);
      res.status(500).json({ success: false, message: "Gagal membuat laporan triwulan" });
    }
  },

  getQuarterlyReports: async (req, res) => {
    try {
      const reports = await prisma.quarterlyReport.findMany({
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
      console.error("Get quarterly reports error:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil laporan triwulan" });
    }
  },

  getQuarterlyReportById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        return res.status(400).json({ success: false, message: "ID tidak valid" });
      }

      const report = await prisma.quarterlyReport.findUnique({
        where: { id }
      });

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan"
        });
      }

      res.status(200).json({
        success: true,
        data: report
      });

    } catch (error) {
      console.error("Get quarterly report error:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil laporan triwulan" });
    }
  },

  updateQuarterlyReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, meetingDate, activitiesSummary } = req.body;

      const updated = await prisma.quarterlyReport.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(meetingDate && { meetingDate }),
          ...(activitiesSummary && { activitiesSummary })
        }
      });

      res.status(200).json({
        success: true,
        message: "Laporan triwulan diperbarui",
        data: updated
      });

    } catch (error) {
      console.error("Update quarterly report error:", error);
      res.status(400).json({ success: false, message: "Gagal memperbarui laporan triwulan" });
    }
  },

  deleteQuarterlyReport: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await prisma.quarterlyReport.delete({
        where: { id }
      });

      res.status(200).json({
        success: true,
        message: "Laporan triwulan berhasil dihapus"
      });

    } catch (error) {
      console.error("Delete quarterly report error:", error);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus laporan triwulan"
      });
    }
  },

  downloadQuarterlyReportPdf: async (req, res) => {
    const { id, name } = req.params;
    console.log("Generating PDF for report ID:", id, "with name:", name);
    try {
      const report = await prisma.quarterlyReport.findUnique({
        where: { id }
      });

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan"
        });
      }

      const liveReports = (report.liveReportIds && report.liveReportIds.length)
        ? await prisma.activity.findMany({
            where: { id: { in: report.liveReportIds } },
            include: { students: { select: { id: true, name: true } } },
            orderBy: { date: 'asc' }
          })
        : [];

      const attendanceDetails = (report.attendanceIds && report.attendanceIds.length)
        ? await prisma.attendance.findMany({
            where: { id: { in: report.attendanceIds } },
            include: { student: { select: { id: true, name: true } } },
            orderBy: { date: 'asc' }
          })
        : [];

      const doc = new PDFDocument({ margin: 40, size: "A4" });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=quarterly-report-${report.quarter}-${report.year}.pdf`
      );
      doc.pipe(res);

      doc.fontSize(14).text("LAPORAN TRIWULAN", { align: "center" });
      doc.moveDown();
      doc.text(`Judul     : ${report.title || 'N/A'}`);
      doc.text(`Kuartal : ${report.quarter}`);
      doc.text(`Tahun    : ${report.year}`);
      doc.text(`Pertemuan   : ${report.meetingDate || 'N/A'}`);

      doc.moveDown();
      doc.fontSize(12).text(`Diunduh oleh : ${name || 'Unknown'} pada ${new Date().toLocaleString('id-ID')}`, { align: "right" });

      doc.moveDown();
      doc.fontSize(12).text("Ringkasan Kegiatan:", { underline: true });
      doc.moveDown(0.3);

      if (liveReports.length === 0) {
        doc.fontSize(10).text("Tidak ada kegiatan dalam periode ini.");
      } else {
        liveReports.forEach((act, idx) => {
          const dateStr = act.date ? new Date(act.date).toLocaleDateString('id-ID') : '-';
          doc.fontSize(11).font('Helvetica-Bold').text(`${idx + 1}. ${act.name} — ${dateStr}`);
          if (act.description) doc.fontSize(10).font('Helvetica').text(`Deskripsi: ${act.description}`);
          const studentNames = (act.students || []).map(s => s.name).filter(Boolean);
          doc.fontSize(10).text(`Jumlah Peserta: ${studentNames.length}`);
          if (studentNames.length > 0) {
            doc.fontSize(9).text(`Peserta: ${studentNames.join(', ')}`);
          }
          doc.moveDown(0.5);
        });
      }

      doc.moveDown();
      doc.fontSize(14).text("Kehadiran:", { underline: true });
      doc.moveDown(0.3);

      if (attendanceDetails.length === 0) {
        doc.fontSize(10).text("Tidak ada data kehadiran dalam periode ini.");
      } else {
        attendanceDetails.forEach((att, idx) => {
          const dateStr = att.date ? new Date(att.date).toLocaleDateString('id-ID') : '-';
          const studentName = att.student?.name || att.studentId || 'Unknown';
          doc.fontSize(11).font('Helvetica-Bold').text(`${idx + 1}. ${studentName} — ${dateStr}`);
          doc.fontSize(10).font('Helvetica').text(`Status: ${att.status}`);
          if (att.notes) doc.fontSize(10).text(`Catatan: ${att.notes}`);
          doc.moveDown(0.5);
        });
      }

      doc.end();

    } catch (error) {
      console.error("PDF generate error:", error);
      res.status(500).json({ success: false, message: "Gagal membuat PDF" });
    }
  },
};

module.exports = quarterlyReportController;