import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaEdit, FaClock } from "react-icons/fa";
import axios from "axios";

interface Report {
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

interface LiveReportProps {
    onNavigateToReport?: () => void; // callback untuk navigasi ke halaman laporan lengkap
}

const LiveReport: React.FC<LiveReportProps> = ({ onNavigateToReport }) => {
    const { data: session } = useSession();
    const token = session?.accessToken;
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";
    const isReadOnly = role === "PARENT";

    const [recentReports, setRecentReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch latest 3 reports from API
    useEffect(() => {
        const fetchRecentReports = async () => {
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
                    // Ambil 3 laporan terbaru saja
                    const latest = res.data.data.slice(0, 3);
                    setRecentReports(latest);
                } else {
                    setRecentReports([]);
                }
            } catch (error) {
                console.error("Failed to fetch recent reports:", error);
                setRecentReports([]);
            }
            setLoading(false);
        };
        fetchRecentReports();
    }, [token]);

    // Format time from date string
    const formatTime = (dateString?: string) => {
        if (!dateString) return "--:--";
        const date = new Date(dateString);
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Handle button click - bisa navigasi ke halaman report atau refresh
    const handleManageReports = () => {
        if (onNavigateToReport) {
            onNavigateToReport();
        }
    };

    return (
        <section className="bg-white rounded-xl shadow p-5">
            <div className="flex flex-row items-center justify-between gap-2 mb-4">
                <h2 className="font-bold text-xl">Laporan Terkini</h2>
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                        Memuat laporan terkini...
                    </div>
                ) : recentReports.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                        Belum ada laporan tersedia
                    </div>
                ) : (
                    recentReports.map((report) => {
                        // Ambil nama kegiatan pertama (jika ada)
                        const rawActivityName = report.activities?.[0]?.name || "";
                        const displayActivityName =
                            kegiatanLabels[rawActivityName] ||
                            rawActivityName ||
                            "Kegiatan Harian";

                        return (
                            <button
                                key={report.id}
                                onClick={handleManageReports}
                                className="flex items-center cursor-pointer gap-3 p-3 rounded-lg shadow hover:shadow-md border transition-all"
                                style={{ borderColor: accentColor, backgroundColor: "#fff" }}
                            >
                                <div
                                    className="p-2 rounded-lg font-bold text-lg flex items-center justify-center"
                                    style={{ backgroundColor: accentColor, color: "#fff" }}
                                >
                                    🗂
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="font-semibold md:text-lg truncate">
                                        {report.title}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {displayActivityName}
                                    </p>
                                    {report.description && (
                                        <p className="text-xs text-gray-400 truncate mt-1">
                                            {report.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                                        <FaClock className="w-3 h-3" />
                                        {formatTime(report.date || report.createdAt)}
                                    </span>
                                    {report.photos && report.photos.length > 0 && (
                                        <span className="text-xs text-gray-400">
                                            📷 {report.photos.length}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default LiveReport;