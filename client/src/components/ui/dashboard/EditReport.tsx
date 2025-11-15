import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Report {
    id: string;
    judul: string;
    namaKegiatan: string;
    kelas: string;
    desc: string;
    foto: string;
}

const KEGIATAN_OPTIONS = [
    { value: "SENAM", label: "Senam" },
    { value: "BERMAIN", label: "Bermain" },
    { value: "BERCERITA", label: "Bercerita" },
    { value: "MAKAN", label: "Makan Siang" },
];

const KELAS_OPTIONS = [
    { value: "A1", label: "A1" },
    { value: "B1", label: "B1" },
];

interface EditReportProps {
    isOpen: boolean;
    onClose: () => void;
    reportData: Report | null;
    onSave: () => void;
}

const EditReport: React.FC<EditReportProps> = ({ isOpen, onClose, reportData, onSave }) => {
    const [formData, setFormData] = useState<Report>({
        id: "",
        judul: "",
        namaKegiatan: "SENAM",
        kelas: "A1",
        desc: "",
        foto: "",
    });
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const token = session?.accessToken;

    useEffect(() => {
        if (isOpen && reportData) {
            setFormData({
                id: reportData.id,
                judul: reportData.judul,
                namaKegiatan: reportData.namaKegiatan,
                kelas: reportData.kelas,
                desc: reportData.desc,
                foto: reportData.foto,
            });
        }
    }, [isOpen, reportData]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                id: "",
                judul: "",
                namaKegiatan: "SENAM",
                kelas: "A1",
                desc: "",
                foto: "",
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
            await axios.put(`${API_URL}/report/${formData.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onSave();
            onClose();
        } catch {
            alert("Gagal mengedit laporan");
        }
        setLoading(false);
    };

    if (!isOpen || !reportData) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-lg">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Edit Laporan</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 transition text-2xl cursor-pointer"
                        title="Close"
                        type="button"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-1">
                            Judul Laporan
                        </label>
                        <input
                            type="text"
                            id="judul"
                            name="judul"
                            value={formData.judul ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="namaKegiatan" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Kegiatan
                        </label>
                        <select
                            id="namaKegiatan"
                            name="namaKegiatan"
                            value={formData.namaKegiatan ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        >
                            {KEGIATAN_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
                            Kelas
                        </label>
                        <select
                            id="kelas"
                            name="kelas"
                            value={formData.kelas ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        >
                            {KELAS_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi Kegiatan
                        </label>
                        <input
                            type="text"
                            id="desc"
                            name="desc"
                            value={formData.desc ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Foto Kegiatan
                        </label>
                        <input
                            type="file"
                            id="foto"
                            name="foto"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                        {formData.foto && (
                            <p className="text-xs text-gray-500 mt-1">
                                File saat ini: {formData.foto}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-white bg-[#3f9065] hover:bg-[#347b56] transition shadow-md"
                        >
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReport;