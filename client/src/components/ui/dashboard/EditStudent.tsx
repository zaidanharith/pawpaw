import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { MdOutlineClose } from "react-icons/md";

interface Parent {
    id: string;
    name: string;
}

interface Classroom {
    id: string;
    name: string;
}

interface Siswa {
    id: string;
    name: string;
    gender: string;
    birthDate: string;
    address: string;
    classroomId?: string;
    parentId?: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const GENDER_OPTIONS = [
    { value: "MALE", label: "Laki-laki" },
    { value: "FEMALE", label: "Perempuan" },
];

interface EditStudentProps {
    isOpen: boolean;
    onClose: () => void;
    studentData: Siswa | null;
    classrooms: Classroom[];
    parents: Parent[];
    onSaved: () => void;
}

const EditStudent: React.FC<EditStudentProps> = ({ 
    isOpen, 
    onClose, 
    studentData, 
    classrooms,
    parents,
    onSaved 
}) => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("MALE");
    const [birthDate, setBirthDate] = useState("");
    const [address, setAddress] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [parentId, setParentId] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { data: session } = useSession();
    const token = session?.accessToken;
    const role = (session?.user as any)?.role || "ADMIN";
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";
    const accentColor = roleColors[role] || roleColors.ADMIN;

    useEffect(() => {
        if (isOpen && studentData) {
            setName(studentData.name);
            setGender(studentData.gender);
            setBirthDate(studentData.birthDate);
            setAddress(studentData.address);
            setClassroomId(studentData.classroomId || "");
            setParentId(studentData.parentId || "");
        }
    }, [isOpen, studentData]);

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setGender("MALE");
            setBirthDate("");
            setAddress("");
            setClassroomId("");
            setParentId("");
        }
    }, [isOpen]);

    if (!isOpen || !studentData) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !gender || !birthDate || !classroomId || !address || !parentId) {
            alert("Mohon isi semua field yang diperlukan.");
            return;
        }

        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            await axios.put(
                `${API_URL}/student/${studentData.id}`,
                {
                    name,
                    gender,
                    birthDate,
                    classroomId,
                    address,
                    parentId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            onSaved();
            onClose();
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Gagal mengedit siswa");
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-lg flex flex-col max-h-[90vh]">
                <div 
                    className="p-4 sm:p-6 border-b rounded-t-2xl border-gray-100 flex justify-between items-center shrink-0"
                    style={{ backgroundColor: accentColor }}
                >
                    <h2 
                        className="text-lg sm:text-xl font-bold text-gray-800"
                        style={{ color: textColor }}
                    >
                        Edit Siswa
                    </h2>
                    <button
                        onClick={onClose}
                        className="hover:opacity-80 transition cursor-pointer"
                        style={{ color: textColor }}
                        title="Tutup"
                        type="button"
                    >
                        <MdOutlineClose className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none text-sm sm:text-base"
                                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                            />
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                Jenis Kelamin
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 text-gray-700 focus:outline-none text-sm sm:text-base"
                                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                            >
                                {GENDER_OPTIONS.map((option) => (
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
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none text-sm sm:text-base"
                                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                            />
                        </div>

                        <div>
                            <label htmlFor="classroomId" className="block text-sm font-medium text-gray-700 mb-1">
                                Kelas
                            </label>
                            <select
                                id="classroomId"
                                name="classroomId"
                                value={classroomId}
                                onChange={(e) => setClassroomId(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 text-gray-700 focus:outline-none text-sm sm:text-base"
                                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                            >
                                <option value="">-- Pilih Kelas --</option>
                                {Array.isArray(classrooms) && classrooms.map((classroom) => (
                                    <option key={classroom.id} value={classroom.id}>
                                        {classroom.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Alamat
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none text-sm sm:text-base"
                                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                            />
                        </div>

                        <div>
                            <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
                                Pilih Orang Tua
                            </label>
                            <select
                                id="parentId"
                                name="parentId"
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 text-gray-700 focus:outline-none text-sm sm:text-base"
                                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                            >
                                <option value="">-- Pilih Orang Tua --</option>
                                {parents.map((parent) => (
                                    <option key={parent.id} value={parent.id}>
                                        {parent.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 cursor-pointer transition order-2 sm:order-1"
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg hover:opacity-80 transition shadow-md order-1 sm:order-2"
                                style={{ backgroundColor: accentColor, color: textColor }}
                            >
                                {loading ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditStudent;