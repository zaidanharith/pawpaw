import React from "react";
import { MdOutlineClose } from "react-icons/md";

interface QuarterlyReport {
  id: string;
  studentName: string;
  studentNumber: string;
  className: string;
  quarter: string;
  year: number;
  teacherName: string;
  notes: string;
  activitiesSummary: string[];
  meetingReminder: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface DetailQuarterlyReportProps {
  report: QuarterlyReport;
  onClose: () => void;
  accentColor: string;
  textColor: string;
  isParent: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DetailQuarterlyReport: React.FC<DetailQuarterlyReportProps> = ({
  report,
  onClose,
  accentColor,
  textColor,
  isParent,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* CARD */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div
          className="p-6 border-b border-gray-100 flex justify-between items-center"
          style={{ backgroundColor: accentColor }}
        >
          <h2 className="text-xl font-bold" style={{ color: textColor }}>
            Detail Laporan Triwulan {report.quarter} {report.year}
          </h2>
          <button
            onClick={onClose}
            className="hover:opacity-80 transition"
            style={{ color: textColor }}
            title="Close"
            type="button"
          >
            <MdOutlineClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* BODY: SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Student Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Nama Siswa
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {report.studentName}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Nomor Induk Siswa
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {report.studentNumber}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Kelas
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {report.className}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Guru Pengampu
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {report.teacherName}
              </p>
            </div>
          </div>

          {/* Quarter & Year */}
          <div
            className="p-4 rounded-lg border-2"
            style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}
          >
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
              Periode Laporan
            </p>
            <p className="text-2xl font-bold" style={{ color: accentColor }}>
              Kuartal {report.quarter} Tahun {report.year}
            </p>
          </div>

          {/* Activities Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Ringkasan Aktivitas
            </h3>
            {report.activitiesSummary && report.activitiesSummary.length > 0 ? (
              <div className="space-y-2">
                {report.activitiesSummary.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700">{activity}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Tidak ada aktivitas yang tercatat</p>
            )}
          </div>

          {/* Notes/Evaluasi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Catatan & Evaluasi
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {report.notes || "Tidak ada catatan"}
              </p>
            </div>
          </div>

          {/* Meeting Reminder */}
          <div
            className="p-4 rounded-lg border-2"
            style={{
              borderColor: report.meetingReminder ? "#f59e0b" : "#d1d5db",
              backgroundColor: report.meetingReminder ? "#fef3c710" : "#f3f4f610",
            }}
          >
            <p className="text-sm font-semibold text-gray-900 mb-1">
              📅 Pengingat Pertemuan Orang Tua
            </p>
            <p className="text-sm text-gray-700">
              {report.meetingReminder
                ? "Laporan ini akan digunakan untuk pertemuan orang tua triwulanan."
                : "Tidak ada pertemuan orang tua pada kuartal ini."}
            </p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 pt-4 border-t">
            <div>
              <p className="font-medium">Dibuat pada:</p>
              <p>
                {formatDate(report.createdAt)} {formatTime(report.createdAt)}
              </p>
            </div>
            <div>
              <p className="font-medium">Diperbarui pada:</p>
              <p>
                {formatDate(report.updatedAt)} {formatTime(report.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="px-6 pb-4 pt-2 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
          >
            Tutup
          </button>

          {!isParent && (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg text-white hover:opacity-80 transition"
                style={{ backgroundColor: "#3b82f6" }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg text-white hover:opacity-80 transition"
                style={{ backgroundColor: "#ef4444" }}
              >
                Hapus
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailQuarterlyReport;