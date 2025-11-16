import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import axios from "axios";
import { useSession } from "next-auth/react";
import { text } from "stream/consumers";

const roles = [
    { value: "ADMIN", label: "Admin" },
    { value: "TEACHER", label: "Guru" },
    { value: "PARENT", label: "Orang Tua" },
];

export interface NewUserData {
    name: string;
    phoneNumber: string;
    username: string;
    email: string;
    role: string;
}

interface AddUserProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewUserData) => void;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const initialForm: NewUserData = {
    name: "",
    phoneNumber: "",
    username: "",
    email: "",
    role: "ADMIN",
};

const AddUser: React.FC<AddUserProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<NewUserData>(initialForm);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const token = session?.accessToken;
    const role = (session?.user as any)?.role || "ADMIN";
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
        if (!formData.name || !formData.email || !formData.role || !formData.username) {
            alert("Mohon lengkapi semua field yang wajib diisi.");
            return;
        }
        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            await axios.post(`${API_URL}/auth/register`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onSave(formData);
            setFormData(initialForm);
            onClose();
        } catch (err) {
            alert("Gagal menambah user");
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
            <div className="relative bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-lg">
                <div className="p-6 border-b border-gray-100 rounded-t-2xl flex justify-between items-center"
                                    style={{ backgroundColor: accentColor }}>
                    <h2 className="text-xl font-bold"
                    style={{color:textColor}}>Tambah User Baru</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:opacity-80 transition cursor-pointer"
                        title="Close"
                        type="button"
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
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Nomor Telepon
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role User
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        >
                            {roles.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
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
                            {loading ? "Menyimpan..." : "Tambah User Baru"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;