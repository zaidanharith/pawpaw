"use client";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";
import axios from "axios";
import AddReport from "./AddReport";
import ReportDetail from "./DetailReport";
import EditReport from "./EditReport";

export interface Report {
  id: string;
  title: string;
  description: string | null;
  date: string;
  teacher?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  activities?: {
    id: string;
    name: string;
    description: string | null;
    date?: string;
  }[];
  photos?: {
    id: string;
    filename: string;
    originalName: string;
    path: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

const kegiatanLabels: Record<string, string> = {
  SENAM: "Senam",
  BERMAIN: "Bermain",
  BERCERITA: "Bercerita",
  MAKAN: "Makan Siang",
};

const ReportPage: React.FC = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role || "ADMIN";

  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";
  const dayChipTextColor = role === "ADMIN" ? "#FFFFFF" : "#282828";
  const isReadOnly = role === "PARENT";

  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isEditReportOpen, setIsEditReportOpen] = useState(false);
  const [editReportData, setEditReportData] = useState<Report | null>(null);

  // toast state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  // auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${API_URL}/livereport`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success && Array.isArray(res.data.data)) {
          setAllReports(res.data.data);
        } else {
          setAllReports([]);
        }
      } catch {
        setAllReports([]);
      }
      setLoading(false);
    };
    fetchReports();
  }, [token]);

  // Refresh reports after add/edit/delete
  const handleRefreshReports = async () => {
    if (!token) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.get(`${API_URL}/livereport`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        setAllReports(res.data.data);
      }
    } catch {
      showToast("error", "Gagal refresh data laporan");
    }
  };

  const handleSaveNewReport = async () => {
    await handleRefreshReports();
    setIsAddReportOpen(false);
    showToast("success", "Laporan berhasil ditambahkan");
  };

  const handleOpenDetail = (report: Report) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  };

  // === DIPANGGIL SAAT KLIK EDIT DI MODAL DETAIL ===
  const handleEditFromDetail = () => {
    if (!selectedReport) return;
    setEditReportData(selectedReport); // isi data untuk form edit
    setIsDetailOpen(false);           // tutup modal detail
    setIsEditReportOpen(true);        // buka modal edit
  };

  const handleDeleteReport = async (id: string) => {
    const ok = confirm("Apakah Anda yakin ingin menghapus laporan ini?");
    if (!ok) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(`${API_URL}/livereport/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await handleRefreshReports();
      setIsDetailOpen(false);
      setSelectedReport(null);
      showToast("success", "Laporan berhasil dihapus");
    } catch (error: any) {
      console.error("Delete report error:", error?.response || error);
      showToast(
        "error",
        error?.response?.data?.message || "Gagal menghapus laporan"
      );
    }
  };

  const handleAfterEditReport = async () => {
    await handleRefreshReports();
    setIsEditReportOpen(false);
    setEditReportData(null);
    showToast("success", "Laporan berhasil diperbarui");
  };

  // Get today's date info
  const today = new Date();
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dayName = dayNames[today.getDay()];
  const dateString = `${today.getDate()} ${
    monthNames[today.getMonth()]
  } ${today.getFullYear()}`;

  // Count today's reports
  const todayReportsCount = allReports.filter((report) => {
    if (!report.date) return false;
    const reportDate = new Date(report.date);
    return reportDate.toDateString() === today.toDateString();
  }).length;

  // Format relative time
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

  // Format date and time
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

  return (
    <>
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* CARD TANGGAL + TOTAL LAPORAN */}
          <div
            className="flex flex-row items-center gap-2 px-4 bg-white border rounded-xl w-full sm:w-auto"
            style={{ borderColor: accentColor }}
          >
            <div
              className="rounded-xl px-3 py-2 my-2 flex flex-col items-center"
              style={{
                backgroundColor: accentColor,
                color: dayChipTextColor,
              }}
            >
              <h3 className="font-semibold text-md">{dayName}</h3>
              <h4 className="font-normal text-sm">{dateString}</h4>
            </div>
            <div className="text-gray-800 px-3 py-2 flex flex-col items-center">
              <h3 className="font-semibold text-sm">Total Laporan Hari Ini</h3>
              <h4 className="font-bold text-3xl">{todayReportsCount}</h4>
            </div>
          </div>

          {/* BUTTON BUAT LAPORAN */}
          {!isReadOnly && (
            <button
              onClick={() => setIsAddReportOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 cursor-pointer rounded-xl text-sm md:text-base font-semibold hover:shadow-lg transition"
              style={{
                backgroundColor: accentColor,
                color: textColor,
              }}
            >
              <FaEdit /> Buat Laporan
            </button>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {loading ? (
          <div className="border rounded-xl p-10 shadow-sm bg-white text-center text-gray-500">
            Memuat data laporan...
          </div>
        ) : allReports.length === 0 ? (
          <div className="border rounded-xl p-10 shadow-sm bg-white text-center text-gray-500">
            Belum ada laporan yang tersedia.
          </div>
        ) : (
          <>
            {allReports.map((report) => {
              const rawActivityName = report.activities?.[0]?.name || "";
              const displayActivityName =
                kegiatanLabels[rawActivityName] ||
                rawActivityName ||
                "Kegiatan Harian";

              return (
                <div
                  key={report.id}
                  className="border rounded-xl p-5 shadow-sm bg-white flex flex-col gap-3"
                  style={{ borderColor: accentColor }}
                >
                  {/* Waktu relatif */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>🕒</span>
                      <span>
                        {getRelativeTime(report.date || report.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Judul + Badge */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {report.title}
                      </h2>
                      <p className="text-gray-700 font-medium">
                        {displayActivityName}
                      </p>
                    </div>

                    <span
                      className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                      style={{ backgroundColor: accentColor }}
                    >
                      {report.teacher?.name
                        ? `Guru: ${report.teacher.name}`
                        : "Guru"}
                    </span>
                  </div>

                  {/* Deskripsi */}
                  <p className="text-sm text-gray-700">
                    {report.description || "Tidak ada deskripsi."}
                  </p>

                  {/* Foto */}
                  {report.photos && report.photos.length > 0 && (
                    <div className="text-xs text-gray-500">
                      📷 {report.photos.length} foto tersedia
                    </div>
                  )}

                  {/* Jam & tanggal */}
                  <p className="text-xs text-gray-500 font-medium">
                    {formatDateTime(report.date || report.createdAt)}
                  </p>

                  {/* Tombol detail */}
                  <button
                    className="w-full py-3 mt-2 rounded-xl font-semibold text-white hover:opacity-90 transition"
                    style={{ backgroundColor: accentColor }}
                    onClick={() => handleOpenDetail(report)}
                  >
                    Lihat Detail Laporan
                  </button>
                </div>
              );
            })}
          </>
        )}
      </section>

      {/* MODAL ADD & EDIT (HANYA ADMIN/GURU) */}
      {!isReadOnly && (
        <>
          <AddReport
            isOpen={isAddReportOpen}
            onClose={() => setIsAddReportOpen(false)}
            onSave={handleSaveNewReport}
          />

          <EditReport
            isOpen={isEditReportOpen}
            onClose={() => {
              setIsEditReportOpen(false);
              setEditReportData(null);
            }}
            reportData={editReportData}
            onSave={handleAfterEditReport}
          />
        </>
      )}

      {/* MODAL DETAIL (SEMUA ROLE BISA LIHAT) */}
      <ReportDetail
        isOpen={isDetailOpen}
        report={selectedReport}
        onClose={() => setIsDetailOpen(false)}
        isReadOnly={isReadOnly}
        onDelete={
          !isReadOnly && selectedReport
            ? () => handleDeleteReport(selectedReport.id)
            : undefined
        }
        onEdit={!isReadOnly ? handleEditFromDetail : undefined}
      />

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg text-sm font-medium text-white z-50 ${
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default ReportPage;