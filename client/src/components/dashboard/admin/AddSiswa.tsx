import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const Gender = [
    { value: "LAKI", label: "Laki-Laki" },
    { value: "PEREMPUAN", label: "Perempuan" },
];

interface NewSiswaData {
  name: string;
  gender: string;
  tanggalLahir: string;
  alamat: string;
}

interface AddSiswaProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewSiswaData) => void;
}

const AddSiswa: React.FC<AddSiswaProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<NewSiswaData>({
        name: "",
        gender: "",
        tanggalLahir: "",
        alamat: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        
        setFormData({
            name: "",
            gender: "",
            tanggalLahir: "",
            alamat: "",
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
                    <h2 className="text-xl font-bold text-gray-800">Tambah Siswa Baru</h2>
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

                    
                    {/* Jenis Kelamin */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        >
                            {Gender.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tanggal Lahir */}
                    <div>
                        <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                        <input
                            type="date"
                            id="tanggalLahir"
                            name="tanggalLahir"
                            value={formData.tanggalLahir}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
                    </div>
                    
                    {/* Alamat */}
                    <div>
                        <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <input
                            type="text"
                            id="alamat"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
                        />
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

export default AddSiswa;