import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { useSession } from "next-auth/react";
import axios from "axios";
import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";

interface Siswa {
    id: string;
    name: string;
    gender: string;
    birthDate: string;
    address: string;
}

const genderColors: Record<string, string> = {
    MALE: "#90caf9",
    FEMALE: "#f48fb1",
};

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const StudentTable: React.FC = () => {
    const { data: session } = useSession();
    const token = session?.accessToken;
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";

    const [allSiswa, setAllSiswa] = useState<Siswa[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
    const [editStudentData, setEditStudentData] = useState<Siswa | null>(null);

    useEffect(() => {
        const fetchSiswa = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const res = await axios.get(`${API_URL}/student`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.success && Array.isArray(res.data.data)) {
                    setAllSiswa(res.data.data);
                } else {
                    setAllSiswa([]);
                }
            } catch {
                setAllSiswa([]);
            }
            setLoading(false);
        };
        fetchSiswa();
    }, [token]);

    const handleSaveStudent = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.get(`${API_URL}/student`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && Array.isArray(res.data.data)) {
                setAllSiswa(res.data.data);
            }
        } catch {
            alert("Gagal refresh data siswa");
        }
    };

    const handleEditStudent = (siswa: Siswa) => {
        setEditStudentData(siswa);
        setIsEditStudentOpen(true);
    };

    const handleSaveEditStudent = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.get(`${API_URL}/student`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && Array.isArray(res.data.data)) {
                setAllSiswa(res.data.data);
            }
        } catch {
            alert("Gagal refresh data siswa");
        }
        setIsEditStudentOpen(false);
        setEditStudentData(null);
    };

    return (
        <>
            <section className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">Daftar Siswa</h2>
                    <button
                        onClick={() => setIsAddStudentOpen(true)}
                        className="cursor-pointer px-3 py-2 rounded-lg text-sm md:text-base font-semibold hover:opacity-80 transition"
                        style={{ backgroundColor: accentColor, color: textColor}}
                        title="Tambah Siswa"
                    >
                        <FaUserPlus />
                    </button>
                </div>
                <div className="rounded-xl">
                    <table className="w-full text-sm text-gray-700 rounded-xl">
                        <thead style={{ backgroundColor: accentColor, color: textColor}}>
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Nama Lengkap</th>
                                <th className="px-4 py-3 text-left font-semibold">Jenis Kelamin</th>
                                <th className="px-4 py-3 text-left font-semibold">Tanggal Lahir</th>
                                <th className="px-4 py-3 text-left font-semibold">Alamat</th>
                                <th className="px-4 py-3 text-left font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-background">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        Memuat data siswa...
                                    </td>
                                </tr>
                            ) : allSiswa.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        Tidak ada data siswa yang tersedia.
                                    </td>
                                </tr>
                            ) : (
                                allSiswa.map((siswa) => (
                                    <tr key={siswa.id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">{siswa.name}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-medium uppercase"
                                                style={{
                                                    backgroundColor: genderColors[siswa.gender.toUpperCase()] || genderColors.MALE,
                                                    color: "#282828"
                                                }}
                                            >
                                                {siswa.gender}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{siswa.birthDate}</td>
                                        <td className="px-4 py-3">{siswa.address}</td>
                                        <td className="px-4 py-3 flex justify-center sm:justify-start gap-3">
                                            <button
                                                onClick={() => handleEditStudent(siswa)}
                                                className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-blue-500 hover:bg-blue-50"
                                                title="Edit Siswa"
                                            >
                                                <MdEdit className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-red-500 hover:bg-red-50"
                                                title="Delete Siswa"
                                            >
                                                <MdDelete className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            <AddStudent
                isOpen={isAddStudentOpen}
                onClose={() => setIsAddStudentOpen(false)}
                onSave={handleSaveStudent}
            />
            <EditStudent
                isOpen={isEditStudentOpen}
                onClose={() => { setIsEditStudentOpen(false); setEditStudentData(null); }}
                studentData={editStudentData}
                onSave={handleSaveEditStudent}
            />
        </>
    );
};

export default StudentTable;