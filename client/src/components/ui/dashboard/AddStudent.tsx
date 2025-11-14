import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface NewStudentData {
    name: string;
    gender: string;
    tanggalLahir: string;
    alamat: string;
}

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
    tanggalLahir: "",
    alamat: "",
};

const AddStudent: React.FC<AddStudentProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<NewStudentData>(initialForm);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const token = session?.accessToken;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.gender || !formData.tanggalLahir || !formData.alamat) {
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
            <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-lg">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Tambah Siswa Baru</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition"
                        title="Close"
                        type="button"
                    >
                        &times;
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
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                            {GENDER_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            id="tanggalLahir"
                            name="tanggalLahir"
                            value={formData.tanggalLahir}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat
                        </label>
                        <input
                            type="text"
                            id="alamat"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition shadow-md"
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