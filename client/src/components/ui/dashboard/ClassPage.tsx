"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FaPlus, FaEdit } from "react-icons/fa";
import AddClassModal from "./AddClass";
import EditClassModal from "./EditClass";

interface Teacher {
    id: string;
    name: string;
}

interface Classroom {
    id: string;
    name: string;
    teacherId: string;
    teacher: Teacher;
}

const ClassroomPage: React.FC = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState<Classroom | null>(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            if (!token) return;

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const res = await axios.get(`${API_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const onlyTeachers = res.data.data.filter(
                    (u: any) => u.role === "TEACHER"
                );

                setTeachers(onlyTeachers);
            } catch {
                setTeachers([]);
            }
        };

        fetchTeachers();
    }, [token]);

    const loadClassrooms = async () => {
        if (!token) return;
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.get(`${API_URL}/classroom`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setClassrooms(res.data.data || []);
        } catch {
            setClassrooms([]);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadClassrooms();
    }, [token]);

    const openEdit = (classroom: Classroom) => {
        setEditData(classroom);
        setIsEditOpen(true);
    };

    return (
        <>
            <section className="bg-white shadow rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Daftar Kelas</h2>

                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="px-3 py-2 rounded-lg cursor-pointer bg-[#3f9065] text-white hover:bg-[#5ba97f] transition flex items-center gap-2"
                    >
                        <FaPlus /> Tambah Kelas
                    </button>
                </div>

                <div className="rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#3f9065] text-white">
                            <tr>
                                <th className="px-4 py-3">Nama Kelas</th>
                                <th className="px-4 py-3">Guru</th>
                                <th className="px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-4">
                                        Memuat...
                                    </td>
                                </tr>
                            ) : classrooms.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-gray-500">
                                        Belum ada kelas yang dibuat.
                                    </td>
                                </tr>
                            ) : (
                                classrooms.map((c) => (
                                    <tr key={c.id} className="border-t">
                                        <td className="px-4 py-3 font-medium">{c.name}</td>
                                        <td className="px-4 py-3">
                                            {c.teacher?.name || "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => openEdit(c)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <AddClassModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                teachers={teachers}
                onSaved={loadClassrooms}
            />

            <EditClassModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                teachers={teachers}
                classroom={editData}
                onSaved={loadClassrooms}
            />
        </>
    );
};

export default ClassroomPage;
