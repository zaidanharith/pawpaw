import React, { useState } from "react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from "next-auth/react";

interface NewStudentData {
    name: string;
    gender: string;
    birthDate: string;
    address: string;
}

interface ExtendedUser {
    role?: string;
}

interface ExtendedSession {
    accessToken?: string;
    user?: ExtendedUser;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const GENDER_OPTIONS = [
    { value: "LAKI", label: "Laki-laki" },
    { value: "PEREMPUAN", label: "Perempuan" },
];

interface AddStudentProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewStudentData) => void;
}

const initialForm: NewStudentData = {
    name: "",
    gender: "LAKI",
    birthDate: "",
    address: "",
};

const AddStudent: React.FC<AddStudentProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<NewStudentData>(initialForm);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const token = (session as ExtendedSession)?.accessToken;
    const role = (session as ExtendedSession)?.user?.role || "ADMIN";
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";
    const accentColor = roleColors[role] || roleColors.ADMIN;


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.gender || !formData.birthDate || !formData.address) {
            alert("Mohon lengkapi semua field.");
            return;
        }
        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            await axios.post(`${API_URL}/student/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onSave(formData);
            setFormData(initialForm);
            onClose();
        } catch {
            alert("Gagal menambah siswa");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-lg">
                <div className="p-6 border-b rounded-t-2xl border-gray-100 flex justify-between items-center"
                    style={{ backgroundColor: accentColor }}>
                    <h2 className="text-xl font-bold text-gray-800"
                    style={{ color: textColor }}>Tambah Siswa Baru   
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 hover:opacity-80 transition"
                        style={{ color: textColor }}
                        title="Tutup"
                        >
                        <MdOutlineClose className="w-6 h-6 cursor-pointer" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                            style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                            Jenis Kelamin
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                            style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
                        >
                            {GENDER_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                            style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                            style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
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
                            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg hover:opacity-80 transition shadow-md"
                            style={{ backgroundColor: accentColor, color: textColor}}
                        >
                            {loading ? "Menyimpan..." : "Simpan Siswa Baru"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;