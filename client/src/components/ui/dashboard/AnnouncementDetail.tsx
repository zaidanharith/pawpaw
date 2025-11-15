import React from "react";

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
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-fadeIn relative">
                
                {/* TITLE */}
                <h2 className="text-xl font-bold mb-3 text-gray-900">
                    {announcement.title}
                </h2>

                {/* CONTENT */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {announcement.content}
                </p>

                {/* DATE INFO */}
                <p className="text-xs text-gray-500 border-t pt-3">
                    Dibuat pada:{" "}
                    {announcement.createdAt
                        ? new Date(announcement.createdAt).toLocaleString("id-ID")
                        : "-"}
                </p>

                {/* BUTTON CLOSE */}
                <button
                    onClick={onClose}
                    className="w-full mt-5 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition"
                    style={{ backgroundColor: accentColor, color: textColor }}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default AnnouncementDetail;