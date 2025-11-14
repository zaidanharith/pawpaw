"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaPlus } from "react-icons/fa6";
import Sidebar from "@/components/layout/Navbar";
import Weather from "./Weather";
import Statistics from "./Statistics";
import LiveReport from "./LiveReport";
import Announcement from "./Announcement";
import AddUser from "./AddUser"; 
import EditUser from "./EditUser";
import AddSiswa from "./AddSiswa";
import EditSiswa from "./EditSiswa";
import TableUser from "./TableUser";
import TableSiswa from "./TableSiswa";

interface User {
    id: number;
    name: string;
    phoneNumber: string;
    username: string;
    email: string;
    password: string;
    role: string;
}

interface Siswa {
  id: number;
  name: string;
  gender: string;
  tanggalLahir: string;
  alamat: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
    LAKI: "#3e89c6",
    PEREMPUAN: "#b34a97"
};

const DUMMY_USER: User[] = [
    { id: 1, name: "Budi Santoso", phoneNumber: "081234567890", username: "budi.s", email: "budi.s@school.id", password: "hash", role: "ADMIN" },
    { id: 2, name: "Siti Rahayu", phoneNumber: "081122334455", username: "siti.r", email: "siti.r@school.id", password: "hash", role: "TEACHER" },
    { id: 3, name: "Ahmad Riyadi", phoneNumber: "089876543210", username: "ahmad.r", email: "ahmad.r@parent.id", password: "hash", role: "PARENT" },
    { id: 4, name: "Dewi Lestari", phoneNumber: "085566778899", username: "dewi.l", email: "dewi.l@school.id", password: "hash", role: "TEACHER" },
];

const DUMMY_SISWA: Siswa[] = [
  { id: 1, name: "Zaki Jeki", gender: "LAKI", tanggalLahir: "2004-12-06", alamat: "Jl. Bersamanya No. 1"}
]

const TAB_USER: Record<string, string> = {
    "Admin": "ADMIN",
    "Guru": "TEACHER",
    "Orang Tua": "PARENT",
};
const TAB_USER_DISPLAY = Object.keys(TAB_USER);

const TAB_GENDER: Record<string, string> = {
    "Laki-Laki": "LAKI",
    "Perempuan": "PEREMPUAN",
};
const TAB_GENDER_DISPLAY = Object.keys(TAB_GENDER);

export default function Admin() {
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    const [activeRoleFilter, setActiveRoleFilter] = useState<string>("Admin");
    const [activeGenderFilter, setActiveGenderFilter] = useState<string>("Laki-Laki");

    const [allUsers, setAllUsers] = useState<User[]>(DUMMY_USER);
    const [allSiswa, setAllSiswa] = useState<Siswa[]>(DUMMY_SISWA);

    const [isModalUserOpen, setIsModalUserOpen] = useState(false);
    const [isModalSiswaOpen, setIsModalSiswaOpen] = useState(false);
    
    const [isModalEditUserOpen, setIsModalEditUserOpen] = useState(false);
    const [isModalEditSiswaOpen, setIsModalEditSiswaOpen] = useState(false);
    
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [siswaToEdit, setSiswaToEdit] = useState<Siswa | null>(null);

    const { data: session } = useSession();
    
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role];
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";


    
    const handleSaveNewUser = (data: Omit<User, 'id' | 'password'> & { password: string }) => {
        const newUser: User = {
            id: Date.now(),
            ...data,
        };
        setAllUsers(prev => [...prev, newUser]);
        console.log("Menyimpan User Baru:", newUser);
        setIsModalUserOpen(false);
    };

    const handleEditUser = (user: User) => {
        setUserToEdit(user);
        setIsModalEditUserOpen(true);
    };

    const handleSaveEditedUser = (data: User) => {
        console.log("Menyimpan Data User Baru", data);
        setIsModalEditUserOpen(false);
        setUserToEdit(null);
    };

    const handleSaveNewSiswa = (data: Omit<Siswa, 'id' | 'name'> & { name: string }) => {
        const newSiswa: Siswa = {
            id: Date.now(),
            ...data,
        };
        setAllSiswa(prev => [...prev, newSiswa]);
        console.log("Menyimpan Siswa Baru:", newSiswa);
        setIsModalSiswaOpen(false);
    };

    const handleEditSiswa = (siswa: Siswa) => {
        setSiswaToEdit(siswa);
        setIsModalEditSiswaOpen(true);
    };

    const handleSaveEditedSiswa = (data: Siswa) => {
        console.log("Menyimpan Data User Baru:", data);
        setIsModalEditSiswaOpen(false);
        setSiswaToEdit(null);
    };

    const filteredUsers = allUsers.filter(user => user.role === TAB_USER[activeRoleFilter]);
    const filteredSiswa = allSiswa.filter(siswa => siswa.gender === TAB_GENDER[activeGenderFilter]);

    const renderContent = () => {
        switch (activeMenu) {
            case "Dashboard":
                return (
                    <div className="flex flex-col gap-5 mx-10">
                        <div className="w-full px-5 py-3 rounded-xl shadow" 
                            style={{ backgroundColor: accentColor, color: textColor }}>
                            <h1 className="font-extrabold text-xl">Dashboard {role.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</h1>
                        </div>
                        <Weather />
                        <Statistics />
                        <LiveReport />
                        <Announcement/>
                    </div>
                );

            case "User":
                return (
                    <div className="flex flex-col gap-5 mx-10">
                        <div className="flex space-x-2 border-b-2 border-gray-100">
                            {TAB_USER_DISPLAY.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setActiveRoleFilter(role)}
                                    className={`px-4 py-2 text-sm font-medium cursor-pointer
                                        ${activeRoleFilter === role
                                            ? "border-b-4  border-[#3f9065] text-[#3f9065] font-semibold"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {role} ({allUsers.filter(u => u.role === TAB_USER[role]).length})
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between items-center bg-white shadow-md rounded-lg h-16">
                            <h3 className="text-2xl font-bold  text-gray-800 mx-4">Daftar {activeRoleFilter}</h3>
                            <button
                                onClick={() => setIsModalUserOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 mx-4 text-sm font-medium rounded-lg text-white bg-[#3f9065] hover:bg-[#347b56] transition cursor-pointer shadow-lg"
                            >
                                <FaPlus /> Tambah User
                            </button>
                        </div>

                        {/* Table */}
                        <TableUser 
                            allUsers={filteredUsers}
                            activeRole={TAB_USER[activeRoleFilter]}
                            onEditUser={handleEditUser}
                            onDeleteUser={(id) => setAllUsers(prev => prev.filter(u => u.id !== id))}
                        />
                    </div>
                );

            case "Siswa":
                return (
                    <div className="flex flex-col gap-5 mx-10">
                        <div className="flex space-x-2 border-b-2 border-gray-100">
                            {TAB_GENDER_DISPLAY.map((gender) => (
                                <button
                                    key={gender}
                                    onClick={() => setActiveGenderFilter(gender)}
                                    className={`px-4 py-2 text-sm font-medium cursor-pointer
                                        ${activeGenderFilter === gender
                                            ? "border-b-4  border-[#3f9065] text-[#3f9065] font-semibold"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {gender} ({allSiswa.filter(s => s.gender === TAB_GENDER[gender]).length})
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between items-center bg-white shadow-md rounded-lg h-16">
                            <h3 className="text-2xl font-bold  text-gray-800 mx-4">Daftar {activeGenderFilter}</h3>
                            <button
                                onClick={() => setIsModalSiswaOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 mx-4 text-sm font-medium rounded-lg text-white bg-[#3f9065] hover:bg-[#347b56] transition cursor-pointer shadow-lg"
                            >
                                <FaPlus /> Tambah Siswa
                            </button>
                        </div>

                        {/* Table */}
                        <TableSiswa 
                            allSiswa={filteredSiswa}
                            activeGender={TAB_GENDER[activeGenderFilter]}
                            onEditSiswa={handleEditSiswa}
                            onDeleteSiswa={(id) => setAllSiswa(prev => prev.filter(s => s.id !== id))}
                        />
                    </div>
                );
            case "Laporan Kegiatan":
                return <div className="p-6 md:p-10 text-center text-gray-700 max-w-7xl mx-auto">📝 Laporan Kegiatan</div>;
            case "Pengumuman":
                return <div className="p-6 md:p-10 text-center text-gray-700 max-w-7xl mx-auto">📢 Pengumuman</div>;
            default:
                return <div className="p-6 md:p-10 text-center text-gray-700 max-w-7xl mx-auto">🏠 Dashboard Admin</div>;
        }
    };

    return (
        <div className="relative min-h-full flex">
            <Sidebar 
                activeMenu={activeMenu} 
                setActiveMenu={setActiveMenu}
            />
            <main className="flex-1">
                {renderContent()}
            </main>
            <AddUser
                isOpen={isModalUserOpen}
                onClose={() => setIsModalUserOpen(false)}
                onSave={handleSaveNewUser}
            />
            <EditUser
                isOpen={isModalEditUserOpen}
                onClose={() => setIsModalEditUserOpen(false)}
                user={userToEdit}
                onSave={handleSaveEditedUser}
            />
            <AddSiswa
                isOpen={isModalSiswaOpen}
                onClose={() => setIsModalSiswaOpen(false)}
                onSave={handleSaveNewSiswa}
            />
            <EditSiswa
                isOpen={isModalEditSiswaOpen}
                onClose={() => setIsModalEditSiswaOpen(false)}
                siswa={siswaToEdit}
                onSave={handleSaveEditedSiswa}
            />
        </div>
    );
}