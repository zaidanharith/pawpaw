import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { MdOutlineClose } from "react-icons/md";

interface Announcement {
    id: string;
    title: string;
    kelas: string;
    content: string;
}

const KELAS_OPTIONS = [
    { value: "A1", label: "A1" },
    { value: "B1", label: "B1" },
    { value: "Semua Kelas", label: "Semua Kelas" },
];

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

interface EditAnnouncementProps {
    isOpen: boolean;
    onClose: () => void;
    reportData: Announcement | null;
    onSave: () => void;
}

const EditAnnouncement: React.FC<EditAnnouncementProps> = ({
    isOpen,
    onClose,
    reportData,
    onSave
}) => {
    const [formData, setFormData] = useState<Announcement>({
        id: "",
        title: "",
        kelas: "A1",
        content: "",
    });

    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role];
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";
    const token = session?.accessToken;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (isOpen && reportData) {
            setFormData({
                id: reportData.id,
                title: reportData.title,
                kelas: reportData.kelas,
                content: reportData.content,
            });
        }
    }, [isOpen, reportData]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                id: "",
                title: "",
                kelas: "A1",
                content: "",
            });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            await axios.put(`${API_URL}/announcement/${formData.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            onSave();
            onClose();
        } catch {
            alert("Gagal mengedit pengumuman");
        }

        setLoading(false);
    };

    if (!isOpen || !reportData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-lg">
                <div className="p-6 border-b border-gray-100 flex rounded-t-2xl justify-between items-center"
                    style={{ backgroundColor: accentColor }}>
                    <h2 className="text-xl font-bold text-gray-800"
                    style={{color: textColor}}>Edit Pengumuman</h2>
                    <button onClick={onClose} 
                    className="hover:opacity-80 transition text-2xl"
                    style={{color: textColor}}>
                    <MdOutlineClose className="w-6 h-6 cursor-pointer" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pengumuman</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                        />
                    </div>

                    {/* Kelas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                        <select
                            name="kelas"
                            value={formData.kelas}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:outline-none"
                            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                        >
                            {KELAS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pengumuman</label>
                        <input
                            type="text"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 cursor-pointer"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-80 text-white transition shadow-md cursor-pointer"
                            style={{ backgroundColor: accentColor, color: textColor}}
                        >
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditAnnouncement;
