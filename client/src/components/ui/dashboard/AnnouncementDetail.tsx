import React from "react";
import { MdOutlineClose } from "react-icons/md";
import { FaClock } from "react-icons/fa";

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Props {
    announcement: Announcement;
    onClose: () => void;
    accentColor: string;
    textColor: string;
}

const AnnouncementDetail: React.FC<Props> = ({
    announcement,
    onClose,
    accentColor,
    textColor,
}) => {
    const rawDate = announcement.createdAt;
    const dateObj = rawDate ? new Date(rawDate) : null;

    const timeStr =
        dateObj?.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        }) ?? "-";

    const fullDateStr =
        dateObj?.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }) ?? "-";

    let relativeStr = "-";
    if (dateObj) {
        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) relativeStr = "Baru saja";
        else if (diffMins < 60) relativeStr = `${diffMins} menit yang lalu`;
        else if (diffHours < 24) relativeStr = `${diffHours} jam yang lalu`;
        else relativeStr = `${diffDays} hari yang lalu`;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* CARD */}
            <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div
                    className="relative px-4 py-2 flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                >
                    {/* TITLE */}
                    <div className="flex flex-col items-center">
                        <h2 className="font-bold text-lg"
                            style={{color: textColor}}>
                            Detail Pengumuman
                        </h2>
                        <p className="text-white/90 text-sm"
                            style={{color: textColor}}>
                            Informasi lengkap pengumuman
                        </p>
                    </div>

                    {/* CLOSE BUTTON */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 hover:opacity-80 transition"
                        style={{ color: textColor }}
                        title="Tutup"
                    >
                        <MdOutlineClose className="w-6 h-6 cursor-pointer" />
                    </button>
                </div>

                {/* =======================
                    BODY – flex-1 + overflow-y-auto
                ======================== */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    
                    {/* TITLE */}
                    <div className="text-center space-y-1">
                        <h3 className="font-bold text-xl text-gray-900">
                            {announcement.title}
                        </h3>

                        {/* WAKTI DI BAWAH JUDUL - seperti gambar */}
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <FaClock />
                            <span>{relativeStr}</span>
                            <span>•</span>
                            <span>{timeStr}</span>
                            <span>|</span>
                            <span>{fullDateStr}</span>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="text-sm">
                        <p className="text-gray-500 text-xs mb-1">Isi Pengumuman</p>
                        <p className="text-gray-700 leading-relaxed">
                            {announcement.content}
                        </p>
                    </div>
                </div>

                {/* =======================
                    FOOTER BUTTON
                ======================== */}
                <div className="px-6 pb-4 pt-2">
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 
                                px-4 py-2.5 rounded-full text-sm font-semibold 
                                shadow-md hover:opacity-80 transition cursor-pointer"
                        style={{ backgroundColor: accentColor, color: textColor }}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetail;