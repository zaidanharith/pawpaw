import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { MdOutlineClose } from "react-icons/md";

interface Siswa {
    id: string;
    name: string;
    gender: string;
    birthDate: string;
    address: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const GENDER_OPTIONS = [
    { value: "LAKI", label: "Laki-Laki" },
    { value: "PEREMPUAN", label: "Perempuan" },
];

interface EditStudentProps {
    isOpen: boolean;
    onClose: () => void;
    studentData: Siswa | null;
    onSave: () => void;
}

const EditStudent: React.FC<EditStudentProps> = ({ isOpen, onClose, studentData, onSave }) => {
    const [formData, setFormData] = useState<Siswa>({
        id: "",
        name: "",
        gender: "LAKI",
        birthDate: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const token = session?.accessToken;
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role];
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (isOpen && studentData) {
            setFormData({
                id: studentData.id,
                name: studentData.name,
                gender: studentData.gender,
                birthDate: studentData.birthDate,
                address: studentData.address,
            });
        }
    }, [isOpen, studentData]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                id: "",
                name: "",
                gender: "LAKI",
                birthDate: "",
                address: "",
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
            await axios.put(`${API_URL}/student/${formData.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onSave();
            onClose();
        } catch {
            alert("Gagal mengedit siswa");
        }
        setLoading(false);
    };

    if (!isOpen || !studentData) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-lg">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"
                    style={{ backgroundColor: accentColor }}>
                    <h2 className="text-xl font-bold text-gray-800"
                    style={{color:textColor}}>Edit Siswa</h2>
                    <button 
                        onClick={onClose} 
                        className="hover:opacity-80 transition text-2xl cursor-pointer"
                        style={{ color: textColor }}
                        title="Close"
                        type="button"
                    >
                        <MdOutlineClose className="w-6 h-6 cursor-pointer"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:outline-none"
                            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                        >
                            {GENDER_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address ?? ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2  focus:outline-none"
                            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                        />
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
                            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-white bg-[#3f9065] hover:opacity-80 transition shadow-md"
                        >
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudent;