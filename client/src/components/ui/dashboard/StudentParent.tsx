import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Classroom {
    id: string;
    name: string;
}

interface Parent {
    id: string;
    name: string;
    email?: string;
}

interface Siswa {
    id: string;
    name: string;
    gender: string;
    birthDate: string;
    classroom?: Classroom;
    classroomId?: string;
    address?: string;
    parent?: Parent | null;
    parentId?: string;
    attendanceSummary?: {
        hadir: number;
        izin: number;
        sakit: number;
        alfa: number;
    };
}

interface Attendance {
    id: string;
    studentId: string;
    status: "hadir" | "izin" | "sakit" | "absent";
    date: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

export default function StudentParent() {
    const { data: session } = useSession();
    const token = session?.accessToken;
    const userId = session?.user?.id;
    const role = session?.user?.role || "PARENT";
    const accentColor = roleColors[role] || roleColors.ADMIN;

    const [students, setStudents] = useState<Siswa[]>([]);
    const [loading, setLoading] = useState(true);
    

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetch = async () => {
            if (!token || !userId) return setLoading(false);
            setLoading(true);
            try {
                const [sres, ares] = await Promise.all([
                    axios.get(`${API_URL}/student`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_URL}/attendance`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const allStudents: Siswa[] = sres.data?.data ?? [];
                const attendances: Attendance[] = ares.data?.data ?? [];

                const withSummary = allStudents.map((s) => {
                    const summary = attendances
                        .filter((a) => a.studentId === s.id)
                        .reduce(
                            (acc, curr) => {
                                switch (curr.status.toLowerCase()) {
                                    case "hadir":
                                        acc.hadir++;
                                        break;
                                    case "izin":
                                        acc.izin++;
                                        break;
                                    case "sakit":
                                        acc.sakit++;
                                        break;
                                    case "absent":
                                    case "alfa":
                                        acc.alfa++;
                                        break;
                                }
                                return acc;
                            },
                            { hadir: 0, izin: 0, sakit: 0, alfa: 0 }
                        );
                    return { ...s, attendanceSummary: summary };
                });

                const myStudents = withSummary.filter((s) => {
                    const pid = s.parent?.id ?? s.parentId;
                    return pid === userId;
                });

                setStudents(myStudents);
            } catch (err) {
                console.error(err);
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        if (role === "PARENT") fetch();
        else setLoading(false);
    }, [token, userId, API_URL, role]);

    

    const formatBirthDate = (iso?: string) =>
        iso ? new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-";

    if (role !== "PARENT") {
        return (
            <section className="bg-white rounded-xl shadow p-5">
                <div className="flex flex-row items-center justify-between gap-2 mb-4">
                    <h2 className="font-bold text-xl">Daftar Siswa Anda</h2>
                </div>
                <div className="text-sm text-gray-500">Halaman ini hanya tersedia untuk akun dengan peran <strong>PARENT</strong>.</div>
            </section>
        );
    }

    return (
            <section className="bg-white rounded-xl shadow p-5">
                <div className="flex flex-row items-center justify-between gap-2 mb-4">
                    <h2 className="font-bold text-xl">Daftar Siswa Anda</h2>
                </div>

                <div className="rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-gray-700 rounded-xl">
                        <thead style={{ backgroundColor: accentColor }}>
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Nama Lengkap</th>
                                <th className="px-4 py-3 text-left font-semibold">Jenis Kelamin</th>
                                <th className="px-4 py-3 text-left font-semibold">Tanggal Lahir</th>
                                <th className="px-4 py-3 text-left font-semibold">Kelas</th>
                                <th className="px-4 py-3 text-left font-semibold">Alamat</th>
                                <th className="px-4 py-3 text-left font-semibold">Hadir</th>
                                <th className="px-4 py-3 text-left font-semibold">Izin</th>
                                <th className="px-4 py-3 text-left font-semibold">Sakit</th>
                                <th className="px-4 py-3 text-left font-semibold">Alfa</th>
                            </tr>
                        </thead>
                        <tbody className="bg-background">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500">Memuat data siswa...</td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500">Anda belum memiliki siswa terdaftar.</td>
                                </tr>
                            ) : (
                                students.map((s) => (
                                    <tr key={s.id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">{s.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium uppercase" style={{ backgroundColor: s.gender === 'MALE' ? '#90caf9' : '#f48fb1', color: '#282828' }}>
                                                {s.gender === 'MALE' ? 'Laki-Laki' : 'Perempuan'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{formatBirthDate(s.birthDate)}</td>
                                        <td className="px-4 py-3">{s.classroom?.name ?? <span className="text-gray-400 italic">Belum ada</span>}</td>
                                        <td className="px-4 py-3 max-w-[200px] truncate">{s.address ?? '-'}</td>
                                        <td className="px-4 py-3 text-center">{s.attendanceSummary?.hadir ?? 0}</td>
                                        <td className="px-4 py-3 text-center">{s.attendanceSummary?.izin ?? 0}</td>
                                        <td className="px-4 py-3 text-center">{s.attendanceSummary?.sakit ?? 0}</td>
                                        <td className="px-4 py-3 text-center">{s.attendanceSummary?.alfa ?? 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
    );
};