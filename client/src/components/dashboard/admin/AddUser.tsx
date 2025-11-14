import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const Role = [
    { value: "ADMIN", label: "Admin" },
    { value: "TEACHER", label: "Guru" },
    { value: "PARENT", label: "Orang Tua" },
];

interface NewUserData {
    name: string;
    phoneNumber: string;
    username: string;
    email: string;
    password: string;
    role: string;
}

interface AddUserProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewUserData) => void;
}

const AddUser: React.FC<AddUserProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<NewUserData>({
        name: "",
        phoneNumber: "",
        username: "",
        email: "",
        password: "",
        role: "ADMIN",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.role) {
            console.error("Please fill in required fields.");
            return;
        }
        onSave(formData);
        
        setFormData({
            name: "",
            phoneNumber: "",
            username: "",
            email: "",
            password: "",
            role: "TEACHER",
        });
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            {/* Modal Container */}
            <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-lg">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Tambah User Baru</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 transition"
                        title="Close"
                    >
                        <MdOutlineClose className="w-6 h-6 cursor-pointer"/>
                    </button>
                </div>

                {/* Modal Body (Form) */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Nama Lengkap */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
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

                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
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
                    
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>
                    
                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role User</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        >
                            {Role.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Form Footer / Actions */}
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
                            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-white bg-[#3f9065] hover:bg-[#347b56] transition shadow-md"
                        >
                            Simpan User Baru
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default AddUser;