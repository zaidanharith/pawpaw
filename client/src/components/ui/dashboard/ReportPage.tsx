import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSession } from "next-auth/react";
import axios from "axios";
import AddReport from "./AddReport";
import EditReport from "./EditReport";

interface Report {
    id: string;
    judul: string;
    namaKegiatan: string;
    kelas: string;
    desc: string;
    foto: string;
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

    const [allReports, setAllReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddReportOpen, setIsAddReportOpen] = useState(false);
    const [isEditReportOpen, setIsEditReportOpen] = useState(false);
    const [editReportData, setEditReportData] = useState<Report | null>(null);

    // Fetch reports from API
    useEffect(() => {
        const fetchReports = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const res = await axios.get(`${API_URL}/report`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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

    // Refresh reports after add/edit
    const handleRefreshReports = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.get(`${API_URL}/report`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && Array.isArray(res.data.data)) {
                setAllReports(res.data.data);
            }
        } catch {
            alert("Gagal refresh data laporan");
        }
    };

    const handleSaveNewReport = async () => {
        await handleRefreshReports();
        setIsAddReportOpen(false);
    };

    const handleEditReport = (report: Report) => {
        setEditReportData(report);
        setIsEditReportOpen(true);
    };

    const handleSaveEditReport = async () => {
        await handleRefreshReports();
        setIsEditReportOpen(false);
        setEditReportData(null);
    };

    const handleDeleteReport = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return;
        
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            await axios.delete(`${API_URL}/report/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await handleRefreshReports();
        } catch {
            alert("Gagal menghapus laporan");
        }
    };

    // Get today's date info
    const today = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayName = dayNames[today.getDay()];
    const dateString = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    // Count today's reports
    const todayReportsCount = allReports.filter(report => {
        if (!report.createdAt) return false;
        const reportDate = new Date(report.createdAt);
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
        const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' });
        return `${time} | ${dateStr}`;
    };

    return (
        <>
            <section>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-row items-center gap-2 px-4 bg-white border-[#3f9065] border rounded-xl w-full sm:w-auto">
                        <div className="bg-[#3f9065] text-white rounded-xl px-3 py-2 my-2 flex flex-col items-center">
                            <h3 className="font-semibold text-md">{dayName}</h3>
                            <h4 className="font-normal text-sm">{dateString}</h4>
                        </div>
                        <div className="text-gray-800 px-3 py-2 flex flex-col items-center">
                            <h3 className="font-semibold text-sm">Total Laporan Hari Ini</h3>
                            <h4 className="font-bold text-3xl">{todayReportsCount}</h4>
                        </div>
                    </div>

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
                    allReports.map((report) => (
                        <div
                            key={report.id}
                            className="border rounded-xl p-5 shadow-sm bg-white flex flex-col gap-3"
                            style={{ borderColor: accentColor }}
                        >
                            {/* Waktu relatif */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <span>🕒</span>
                                    <span>{getRelativeTime(report.createdAt)}</span>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditReport(report)}
                                        className="cursor-pointer hover:scale-110 transition-transform p-2 rounded-full text-blue-500 hover:bg-blue-50"
                                        title="Edit Laporan"
                                    >
                                        <MdEdit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReport(report.id)}
                                        className="cursor-pointer hover:scale-110 transition-transform p-2 rounded-full text-red-500 hover:bg-red-50"
                                        title="Hapus Laporan"
                                    >
                                        <MdDelete className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Judul + Badge */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {report.judul}
                                    </h2>
                                    <p className="text-gray-700 font-medium">
                                        {kegiatanLabels[report.namaKegiatan] || report.namaKegiatan}
                                    </p>
                                </div>

                                <span
                                    className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    Kelas {report.kelas}
                                </span>
                            </div>

                            {/* Deskripsi */}
                            <p className="text-sm text-gray-700">
                                {report.desc}
                            </p>

                            {/* Foto */}
                            {report.foto && (
                                <div className="text-xs text-gray-500">
                                    📷 Foto tersedia
                                </div>
                            )}

                            {/* Jam & tanggal */}
                            <p className="text-xs text-gray-500 font-medium">
                                {formatDateTime(report.createdAt)}
                            </p>

                            {/* Tombol */}
                            <button
                                className="w-full py-3 mt-2 rounded-xl font-semibold text-white hover:opacity-90 transition"
                                style={{ backgroundColor: accentColor }}
                            >
                                Lihat Detail Laporan
                            </button>
                        </div>
                    ))
                )}
            </section>

            {/* Modals */}
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
                onSave={handleSaveEditReport}
            />
        </>
    );
};

export default ReportPage;