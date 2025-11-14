import React, { useState, useEffect } from "react";

interface User {
    id: number;
    name: string;
    phoneNumber: string;
    username: string;
    email: string;
    password: string;
    role: string;
}

const ROLE_OPTIONS = [
    { value: "ADMIN", label: "Admin" },
    { value: "TEACHER", label: "Guru" },
    { value: "PARENT", label: "Orang Tua" },
];

interface EditUserProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (data: User) => void;
}

const EditUser: React.FC<EditUserProps> = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState<User>({
        id: 0,
        name: "",
        phoneNumber: "",
        username: "",
        email: "",
        password: "",
        role: "TEACHER",
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

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
        onClose();
    };

    if (!isOpen || !user) {
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
                    <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 transition text-2xl"
                        title="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body (Form) */}
                <form onSubmit={handleSubmit} className="p-6 space-y-2">
                    
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
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#3f9065] focus:border-[#3f9065] transition"
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
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#3f9065] focus:border-[#3f9065] transition"
                        />
                    </div>
                    
                    {/* Password Note */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#3f9065] focus:border-[#3f9065] transition"
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
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#3f9065] focus:border-[#3f9065] transition"
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
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#3f9065] focus:border-[#3f9065] transition"
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
                            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-[#3f9065] focus:border-[#3f9065] transition"
                        >
                            {ROLE_OPTIONS.map(option => (
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
                            Simpan Perubahan
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default EditUser;