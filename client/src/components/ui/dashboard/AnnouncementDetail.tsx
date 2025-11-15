import React from "react";
import { motion } from "framer-motion";

interface Announcement {
    id: string;
    title: string;
    kelas: string;
    content: string;
    createdAt?: string;
}

interface Props {
    announcement: Announcement;
    onClose: () => void;
}

const AnnouncementDetail: React.FC<Props> = ({ announcement, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
            >
                <h2 className="text-2xl font-bold mb-2 text-gray-700">
                    {announcement.title}
                </h2>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {announcement.content}
                </p>

                <p className="text-xs text-gray-500">
                    Dibuat:{" "}
                    {announcement.createdAt
                        ? new Date(announcement.createdAt).toLocaleString("id-ID")
                        : "-"}
                </p>

                <button
                    onClick={onClose}
                    className="w-full mt-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-[#6CC2FF] to-[#A6E3A1] text-gray-700 hover:opacity-90 transition"
                >
                    Tutup
                </button>
            </motion.div>
        </div>
    );
};

export default AnnouncementDetail;