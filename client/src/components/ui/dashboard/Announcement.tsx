import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaEdit, FaClock } from "react-icons/fa";
import axios from "axios";

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

interface AnnouncementProps {
    onNavigateToAnnouncement?: () => void; // callback untuk navigasi ke halaman pengumuman lengkap
}

const Announcement: React.FC<AnnouncementProps> = ({ onNavigateToAnnouncement }) => {
    const { data: session } = useSession();
    const role = (session?.user?.role || "ADMIN").toUpperCase();
    const token = session?.accessToken;
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";
    const isParent = role === "PARENT";

    const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch latest 3 announcements from API
    useEffect(() => {
        const fetchRecentAnnouncements = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const res = await axios.get(`${API_URL}/announcement`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.data.success && Array.isArray(res.data.data)) {
                    // Ambil 3 pengumuman terbaru saja
                    const latest = res.data.data.slice(0, 3);
                    setRecentAnnouncements(latest);
                } else if (Array.isArray(res.data.data)) {
                    // Jika tidak ada property success tapi data array
                    const latest = res.data.data.slice(0, 3);
                    setRecentAnnouncements(latest);
                } else {
                    setRecentAnnouncements([]);
                }
            } catch (error) {
                console.error("Failed to fetch recent announcements:", error);
                setRecentAnnouncements([]);
            }
            setLoading(false);
        };
        fetchRecentAnnouncements();
    }, [token]);

    // Handle button click - navigasi ke halaman pengumuman atau refresh
    const handleManageAnnouncements = () => {
        if (onNavigateToAnnouncement) {
            onNavigateToAnnouncement();
        }
    };

    // Get icon based on title or content
    const getIcon = (title: string, content: string) => {
        const lowerTitle = title.toLowerCase();
        const lowerContent = content.toLowerCase();
        
        if (lowerTitle.includes("senam") || lowerContent.includes("senam")) return "🏃";
        if (lowerTitle.includes("libur") || lowerContent.includes("libur")) return "🎉";
        if (lowerTitle.includes("raport") || lowerContent.includes("raport")) return "📄";
        if (lowerTitle.includes("ujian") || lowerContent.includes("ujian")) return "📝";
        if (lowerTitle.includes("acara") || lowerContent.includes("acara")) return "🎊";
        if (lowerTitle.includes("kesehatan") || lowerContent.includes("kesehatan")) return "⚕️";
        if (lowerTitle.includes("pertemuan") || lowerContent.includes("pertemuan")) return "👥";
        
        return "🔔"; // default icon
    };
    
    return (
        <section className="bg-white rounded-xl shadow p-5">
            <div className="flex flex-row items-center justify-between gap-2 mb-4">
                <h2 className="font-bold text-xl">Pengumuman</h2>

                {!isParent && (
                    <button
                        className="cursor-pointer px-3 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-80 transition flex items-center justify-center"
                        style={{
                            backgroundColor: accentColor,
                            color: textColor,
                        }}
                    >
                        <FaEdit />
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                        Memuat pengumuman terkini...
                    </div>
                ) : recentAnnouncements.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                        Belum ada pengumuman tersedia
                    </div>
                ) : (
                    recentAnnouncements.map((item) => (
                        <button
                            key={item.id}
                            onClick={handleManageAnnouncements}
                            className="flex items-center gap-3 p-3 rounded-lg shadow hover:shadow-md border cursor-pointer transition-all"
                            style={{ borderColor: accentColor, backgroundColor: "#fff" }}
                        >
                            <div
                                className="p-2 rounded-lg font-bold text-lg flex items-center justify-center min-w-[40px]"
                                style={{ backgroundColor: accentColor, color: textColor }}
                            >
                                {getIcon(item.title, item.content)}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="font-semibold md:text-lg truncate">{item.title}</p>
                                <p className="text-xs text-gray-500 truncate">
                                    {item.content.length > 60 
                                        ? `${item.content.substring(0, 60)}...` 
                                        : item.content
                                    }
                                </p>
                                {item.kelas && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Kelas: {item.kelas}
                                    </p>
                                )}
                            </div>
                            {item.createdAt && (
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <FaClock className="w-3 h-3" />
                                    <span>
                                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </span>
                                </div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </section>
    );
};

export default Announcement;