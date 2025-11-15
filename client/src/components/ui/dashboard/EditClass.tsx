"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from "next-auth/react";

interface Teacher {
    id: string;
    name: string;
}

interface Classroom {
    id: string;
    name: string;
    teacherId: string;
}

interface EditClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    teachers: Teacher[];
    classroom: Classroom | null;
    onSaved: () => void;
}

const EditClassModal: React.FC<EditClassModalProps> = ({
    isOpen,
    onClose,
    teachers,
    classroom,
    onSaved,
}) => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    const [className, setClassName] = useState("");
    const [teacherId, setTeacherId] = useState("");

    useEffect(() => {
        if (classroom) {
            setClassName(classroom.name);
            setTeacherId(classroom.teacherId);
        }
    }, [classroom]);

    if (!isOpen || !classroom) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            await axios.put(
                `${API_URL}/classroom/${classroom.id}`,
                {
                    name: className,
                    teacherId: teacherId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            onSaved();
            onClose();
        } catch {
            alert("Gagal mengedit kelas.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-lg">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Edit Kelas</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition cursor-pointer"
                    >
                        <MdOutlineClose className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Kelas
                        </label>
                        <input
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pilih Guru
                        </label>
                        <select
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-green-600 focus:outline-none"
                        >
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer transition"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 cursor-pointer shadow-md transition"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClassModal;
