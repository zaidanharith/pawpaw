import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSession } from "next-auth/react";
import axios from "axios";
import AddAnnouncement from "./AddAnnouncement";
import EditAnnouncement from "./EditAnnouncement";
import AnnouncementDetail from "./AnnouncementDetail";

interface Announcement {
    id: string;
    title: string;
    kelas: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const AnnouncementPage: React.FC = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;
    const role = session?.user?.role || "ADMIN";

    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

    const isParent = role === "PARENT";

    const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
    const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
    const [editAnnouncementData, setEditAnnouncementData] =
        useState<Announcement | null>(null);

    const [detailAnnouncement, setDetailAnnouncement] =
        useState<Announcement | null>(null);

    // Fetch announcements
    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const res = await axios.get(`${API_URL}/announcement`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (Array.isArray(res.data.data)) {
                    setAllAnnouncements(res.data.data);
                } else {
                    setAllAnnouncements([]);
                }
            } catch {
                setAllAnnouncements([]);
            }
            setLoading(false);
        };

        fetchAnnouncements();
    }, [token]);

    const handleRefreshAnnouncements = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.get(`${API_URL}/announcement`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(res.data.data)) {
                setAllAnnouncements(res.data.data);
            }
        } catch {
            alert("Gagal refresh data pengumuman");
        }
    };

    const handleSaveNewAnnouncement = async () => {
        await handleRefreshAnnouncements();
        setIsAddAnnouncementOpen(false);
    };

    const handleEditAnnouncement = (report: Announcement) => {
        setEditAnnouncementData(report);
        setIsEditAnnouncementOpen(true);
    };

    const handleSaveEditAnnouncement = async () => {
        await handleRefreshAnnouncements();
        setIsEditAnnouncementOpen(false);
        setEditAnnouncementData(null);
    };

    const handleDeleteAnnouncement = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return;

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            await axios.delete(`${API_URL}/pengumuman/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await handleRefreshAnnouncements();
        } catch {
            alert("Gagal menghapus pengumuman");
        }
    };

    const today = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
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
    const dateString = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    const todayAnnouncementsCount = allAnnouncements.filter((report) => {
        if (!report.createdAt) return false;
        const reportDate = new Date(report.createdAt);
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
            {/* HEADER CARD */}
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
                            <h3 className="font-semibold text-sm">
                                Total Pengumuman Hari Ini
                            </h3>
                            <h4 className="font-bold text-3xl">
                                {todayAnnouncementsCount}
                            </h4>
                        </div>
                    </div>

                    {!isParent && (
                        <button
                            onClick={() => setIsAddAnnouncementOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 cursor-pointer rounded-xl text-sm md:text-base font-semibold hover:shadow-lg transition"
                            style={{
                                backgroundColor: accentColor,
                                color: textColor,
                            }}
                        >
                            <FaEdit /> Buat Pengumuman
                        </button>
                    )}
                </div>
            </section>

            {/* LIST ANNOUNCEMENT */}
            <section className="flex flex-col gap-4 mt-4">
                {loading ? (
                    <div className="border rounded-xl p-10 shadow-sm bg-white text-center text-gray-500">
                        Memuat data pengumuman...
                    </div>
                ) : allAnnouncements.length === 0 ? (
                    <div className="border rounded-xl p-10 shadow-sm bg-white text-center text-gray-500">
                        Belum ada pengumuman yang tersedia.
                    </div>
                ) : (
                    allAnnouncements.map((report) => (
                        <div
                            key={report.id}
                            className="border rounded-xl p-5 shadow-sm bg-white flex flex-col gap-3"
                            style={{ borderColor: accentColor }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <span>🕒</span>
                                    <span>{getRelativeTime(report.createdAt)}</span>
                                </div>

                                {!isParent && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditAnnouncement(report)}
                                            className="cursor-pointer hover:scale-110 transition-transform p-2 rounded-full text-blue-500 hover:bg-blue-50"
                                        >
                                            <MdEdit className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteAnnouncement(report.id)
                                            }
                                            className="cursor-pointer hover:scale-110 transition-transform p-2 rounded-full text-red-500 hover:bg-red-50"
                                        >
                                            <MdDelete className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-gray-700">{report.content}</p>

                            <p className="text-xs text-gray-500 font-medium">
                                {formatDateTime(report.createdAt)}
                            </p>

                            <button
                                className="w-full py-3 mt-2 rounded-xl font-semibold text-white hover:opacity-90 transition"
                                style={{ backgroundColor: accentColor }}
                            >
                                Lihat Detail Pengumuman
                            </button>
                        </div>
                    ))
                )}
            </section>

            {/* MODALS */}
            {!isParent && (
                <>
                    <AddAnnouncement
                        isOpen={isAddAnnouncementOpen}
                        onClose={() => setIsAddAnnouncementOpen(false)}
                        onSave={handleSaveNewAnnouncement}
                    />

                    <EditAnnouncement
                        isOpen={isEditAnnouncementOpen}
                        onClose={() => {
                            setIsEditAnnouncementOpen(false);
                            setEditAnnouncementData(null);
                        }}
                        reportData={editAnnouncementData}
                        onSave={handleSaveEditAnnouncement}
                    />
                </>
            )}

            {/* DETAIL MODAL */}
            {detailAnnouncement && (
                <AnnouncementDetail
                    announcement={detailAnnouncement}
                    onClose={() => setDetailAnnouncement(null)}
                />
            )}
        </>
    );
};

export default AnnouncementPage;