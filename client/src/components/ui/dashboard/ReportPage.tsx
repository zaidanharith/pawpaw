"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaClock } from "react-icons/fa";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
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

type UserRole = "ADMIN" | "TEACHER" | "PARENT";

const textColors: Record<UserRole, string> = {
    ADMIN: "#ffffff",
    TEACHER: "#3d3006",
    PARENT: "#063d35",
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
  const textColor = textColors[role] || textColors.ADMIN;
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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  
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
      } catch (error) {
        const err = error as AxiosError;
        console.error("Fetch reports error:", err.response || err);
        setAllReports([]);
      }
      setLoading(false);
    };
    fetchReports();
  }, [token]);

  
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
    } catch (error) {
      const err = error as AxiosError;
      console.error("Refresh reports error:", err.response || err);
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

  
  const handleEditFromDetail = () => {
    if (!selectedReport) return;
    setEditReportData(selectedReport); 
    setIsDetailOpen(false); 
    setIsEditReportOpen(true); 
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
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("Delete report error:", err.response || err);
      showToast(
        "error",
        err.response?.data?.message || "Gagal menghapus laporan"
      );
    }
  };

  const handleAfterEditReport = async () => {
    await handleRefreshReports();
    setIsEditReportOpen(false);
    setEditReportData(null);
    showToast("success", "Laporan berhasil diperbarui");
  };

  
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

  
  const todayReportsCount = allReports.filter((report) => {
    if (!report.date) return false;
    const reportDate = new Date(report.date);
    return reportDate.toDateString() === today.toDateString();
  }).length;


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

  return (
    <>
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: accentColor, color: textColor }}>
              <div className="font-semibold text-lg">{dayName}</div>
              <div className="text-xs opacity-90">{dateString}</div>
            </div>

            <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm" style={{ borderColor: accentColor }}>
              <div className="text-sm text-gray-600">Total Laporan Hari Ini</div>
              <div className="font-bold text-3xl mt-1">{todayReportsCount}</div>
            </div>
          </div>

          {!isReadOnly && (
            <div className="w-full sm:w-auto">
              <button
                onClick={() => setIsAddReportOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm md:text-base font-semibold hover:opacity-80 transition cursor-pointer"
                style={{ backgroundColor: accentColor, color: textColor }}
              >
                <FaEdit /> Buat Laporan
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-4">
        {loading ? (
          <div className="border rounded-xl p-10 shadow-sm bg-white text-center text-gray-500">
            Memuat data laporan...
          </div>
        ) : allReports.length === 0 ? (
          <div className="border rounded-xl p-10 shadow-sm bg-white text-center text-gray-500">
            Belum ada laporan yang tersedia.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allReports.map((report) => {
              const rawActivityName = report.activities?.[0]?.name || "";
              const displayActivityName =
                kegiatanLabels[rawActivityName] ||
                rawActivityName ||
                "Kegiatan Harian";

              const teacherName = report.teacher?.name || "Guru";

              return (
                <article
                  key={report.id}
                  className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full"
                  style={{ borderColor: accentColor }}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
                        <div className="mt-1 text-sm text-gray-600">{displayActivityName}</div>
                      </div>

                      <div className="flex flex-col items-end text-right">
                        <div className="px-3 py-1 rounded-xl text-sm font-semibold" style={{ backgroundColor: accentColor, color: textColor }}>{teacherName}</div>
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2"><FaClock /> {getRelativeTime(report.date || report.createdAt)}</div>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-gray-700">{report.description || "Tidak ada deskripsi."}</p>

                    {report.photos && report.photos.length > 0 ? (
                      <div className="mt-3 flex items-center gap-2">
                        {report.photos.slice(0,3).map((p) => (
                          <div key={p.id} className="w-16 h-12 relative rounded-md overflow-hidden border">
                            <Image src={p.path || p.filename} alt={p.originalName || 'photo'} fill style={{ objectFit: 'cover' }} />
                          </div>
                        ))}
                        {report.photos.length > 3 && <div className="text-xs text-gray-500">+{report.photos.length - 3} lainnya</div>}
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-gray-400">Tidak ada foto</div>
                    )}

                    <div className="mt-2 text-xs text-gray-500">{formatDateTime(report.date || report.createdAt)}</div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => handleOpenDetail(report)} className="flex-1 px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition cursor-pointer" style={{ backgroundColor: accentColor, color: textColor }}>{'Lihat Detail'}</button>
                    {!isReadOnly && (
                      <button onClick={() => { setEditReportData(report); setIsEditReportOpen(true); }} className="px-3 py-1.5 rounded-lg bg-gray-50 hover:border-2 border cursor-pointer" style={{ borderColor: accentColor }}>Edit</button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
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