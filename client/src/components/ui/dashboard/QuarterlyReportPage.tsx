import React, { useEffect, useState } from "react";
import { FaEdit, FaClock } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSession } from "next-auth/react";
import axios from "axios";
import AddQuarterlyReport from "./AddQuarterlyReport";
import EditQuarterlyReport from "./EditQuarterlyReport";
import DetailQuarterlyReport from "./DetailQuarterlyRepost";

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

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

const QuarterlyReportPage: React.FC = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  // FIX: UPPERCASE ROLE (SANGAT PENTING)
  const role = (session?.user?.role || "ADMIN").toUpperCase();

  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";

  const isParent = role === "PARENT";

  const [allReports, setAllReports] = useState<QuarterlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [filterQuarter, setFilterQuarter] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  // Fetch quarterly reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${API_URL}/quarterly-reports`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            quarter: filterQuarter || undefined,
            year: filterYear || undefined,
          },
        });

        setAllReports(Array.isArray(res.data.data) ? res.data.data : []);
      } catch {
        setAllReports([]);
      }
      setLoading(false);
    };

    fetchReports();
  }, [token, filterQuarter, filterYear]);

  const handleRefreshReports = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.get(`${API_URL}/quarterly-reports`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          quarter: filterQuarter || undefined,
          year: filterYear || undefined,
        },
      });

      if (Array.isArray(res.data.data)) {
        setAllReports(res.data.data);
      }
    } catch {
      alert("Gagal refresh data laporan triwulan");
    }
  };

  const [isEditReportOpen, setIsEditReportOpen] = useState(false);
  const [editReportData, setEditReportData] = useState<QuarterlyReport | null>(null);

  const handleSaveNewReport = async () => {
    await handleRefreshReports();
    setIsAddReportOpen(false);
  };

  const handleEditReport = (report: QuarterlyReport) => {
    setEditReportData(report);
    setIsEditReportOpen(true);
  };

  const handleSaveEditReport = async () => {
    await handleRefreshReports();
    setIsEditReportOpen(false);
    setEditReportData(null);
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan triwulan ini?")) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      await axios.delete(`${API_URL}/quarterly-reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await handleRefreshReports();
    } catch {
      alert("Gagal menghapus laporan triwulan");
    }
  };

  // Date formatting utilities
  const today = new Date();
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayName = dayNames[today.getDay()];
  const dateString = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "- | -";
    const date = new Date(dateString);
    const time = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    return `${time} | ${dateStr}`;
  };

  const [detailReport, setDetailReport] = useState<QuarterlyReport | null>(null);

  return (
    <>
      {/* HEADER */}
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-row items-center gap-2 px-4 bg-white rounded-xl w-full sm:w-auto border"
            style={{ borderColor: accentColor }}
          >
            <div
              className="rounded-xl px-3 py-2 my-2 flex flex-col items-center"
              style={{ backgroundColor: accentColor, color: textColor }}
            >
              <h3 className="font-semibold text-md">{dayName}</h3>
              <h4 className="font-normal text-sm">{dateString}</h4>
            </div>

            <div className="text-gray-800 px-3 py-2 flex flex-col items-center">
              <h3 className="font-semibold text-sm">Total Laporan Triwulan</h3>
              <h4 className="font-bold text-3xl">{allReports.length}</h4>
            </div>
          </div>

          {!isParent && (
            <button
              onClick={() => setIsAddReportOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 cursor-pointer rounded-xl text-sm md:text-base font-semibold hover:opacity-80 transition"
              style={{ backgroundColor: accentColor, color: textColor }}
            >
              <FaEdit /> Buat Laporan Triwulan
            </button>
          )}
        </div>
      </section>

      {/* FILTER */}
      <section className="bg-white border rounded-xl p-4 space-y-3"
        style={{ borderColor: accentColor }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Kuartal
            </label>
            <select
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            >
              <option value="">Semua Kuartal</option>
              <option value="Q1">Q1 (Januari - Maret)</option>
              <option value="Q2">Q2 (April - Juni)</option>
              <option value="Q3">Q3 (Juli - September)</option>
              <option value="Q4">Q4 (Oktober - Desember)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Tahun
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="flex flex-col gap-4 mt-4">
        {loading ? (
          <div className="border rounded-xl p-10 shadow-sm bg-white text-center text-gray-500"
            style={{ borderColor: accentColor }}>
            Memuat data laporan triwulan...
          </div>
        ) : allReports.length === 0 ? (
          <div className="border rounded-xl p-10 shadow-sm bg-white text-center text-gray-500"
            style={{ borderColor: accentColor }}>
            Belum ada laporan triwulan yang tersedia.
          </div>
        ) : (
          allReports.map((report) => (
            <div
              key={report.id}
              className="border rounded-xl p-5 shadow-sm bg-white flex flex-col gap-3"
              style={{ borderColor: accentColor }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span><FaClock /></span>
                  <span>{getRelativeTime(report.createdAt)}</span>
                </div>

                {!isParent && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReport(report)}
                      className="cursor-pointer hover:scale-110 transition-transform p-2 rounded-full text-blue-500 hover:bg-blue-50"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="cursor-pointer hover:scale-110 transition-transform p-2 rounded-full text-red-500 hover:bg-red-50"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {report.studentName}
                </h2>
                <p className="text-sm text-gray-600">
                  {report.className} | {report.quarter} {report.year}
                </p>
              </div>

              <p className="text-sm text-gray-700">{report.notes}</p>

              <div className="flex gap-2 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: accentColor, color: textColor }}
                >
                  Guru: {report.teacherName}
                </span>
                {report.meetingReminder && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                    📅 Ada Pertemuan Orang Tua
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 font-medium">
                {formatDateTime(report.createdAt)}
              </p>

              <button
                onClick={() => setDetailReport(report)}
                className="w-full py-3 mt-2 rounded-xl font-semibold text-white hover:opacity-80 transition cursor-pointer"
                style={{ backgroundColor: accentColor, color: textColor }}
              >
                Lihat Detail Laporan Triwulan
              </button>
            </div>
          ))
        )}
      </section>

      {/* ADD & EDIT MODALS */}
      {!isParent && (
        <>
          <AddQuarterlyReport
            isOpen={isAddReportOpen}
            onClose={() => setIsAddReportOpen(false)}
            onSave={handleSaveNewReport}
          />

          <EditQuarterlyReport
            isOpen={isEditReportOpen}
            onClose={() => {
              setIsEditReportOpen(false);
              setEditReportData(null);
            }}
            reportData={editReportData}
            onSave={handleSaveEditReport}
          />
        </>
      )}

      {/* DETAIL MODAL */}
      {detailReport && (
        <DetailQuarterlyReport
          report={detailReport}
          onClose={() => setDetailReport(null)}
          accentColor={accentColor}
          textColor={textColor}
          isParent={isParent}
          onEdit={() => {
            handleEditReport(detailReport);
            setDetailReport(null);
          }}
          onDelete={() => {
            handleDeleteReport(detailReport.id);
            setDetailReport(null);
          }}
        />
      )}
    </>
  );
};

export default QuarterlyReportPage;