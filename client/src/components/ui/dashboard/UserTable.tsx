import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import RoleLabel from "./RoleLabel";
import { FaUserPlus } from "react-icons/fa";
import AddUser, { type NewUserData } from "./AddUser";
import EditUser from "./EditUser";
import DeleteConfirmation from "../DeleteConfirmation";

interface User {
    id: string;
    name: string;
    phoneNumber: string;
    username: string;
    email: string;
    role: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};


const UserTable = () => {
    const { data: session } = useSession();
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";
    const token = session?.accessToken;

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [editUserData, setEditUserData] = useState<User | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const res = await axios.get(`${API_URL}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.success && Array.isArray(res.data.data)) {
                    setAllUsers(res.data.data);
                } else {
                    setAllUsers([]);
                }
            } catch {
                setAllUsers([]);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [token]);

    const handleSaveUser = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.get(`${API_URL}/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && Array.isArray(res.data.data)) {
                setAllUsers(res.data.data);
            }
        } catch {
            alert("Gagal refresh data user");
        }
    };

    const handleEditUser = (user: User) => {
        setEditUserData(user);
        setIsEditUserOpen(true);
    };

    const handleSaveEditUser = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.get(`${API_URL}/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && Array.isArray(res.data.data)) {
                setAllUsers(res.data.data);
            }
        } catch {
            alert("Gagal refresh data user");
        }
        setIsEditUserOpen(false);
        setEditUserData(null);
    };

    const openDeleteConfirm = (user: User) => {
        setDeleteConfirm({ open: true, user });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ open: false, user: null });
    };

    const confirmDeleteUser = async () => {
        if (!deleteConfirm.user) return;
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.delete(`${API_URL}/user/${deleteConfirm.user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAllUsers((prevUsers) => prevUsers.filter((u) => u.id !== deleteConfirm.user!.id));
            } else {
                alert("Gagal menghapus user");
            }
        } catch {
            alert("Gagal menghapus user");
        }
        closeDeleteConfirm();
    };

    return (
        <>
            <section className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">Daftar User</h2>
                    <button
                        onClick={() => setIsAddUserOpen(true)}
                        className="cursor-pointer px-3 py-2 rounded-lg text-sm md:text-base font-semibold hover:bg-opacity-80 transition"
                        style={{
                            backgroundColor: accentColor,
                            color: textColor,
                        }}
                        title="Tambah User"
                    >
                        <FaUserPlus />
                    </button>
                </div>
                <div className="rounded-xl overflow-x-scroll">
                    <table className="w-full text-sm text-gray-700 rounded-xl">
                        <thead style={{ backgroundColor: accentColor, color:textColor }}>
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Nama Lengkap</th>
                                <th className="px-4 py-3 text-left font-semibold">Username</th>
                                <th className="px-4 py-3 text-left font-semibold">Email</th>
                                <th className="px-4 py-3 text-left font-semibold">Role</th>
                                <th className="px-4 py-3 text-left font-semibold">Aksi   </th>
                            </tr>
                        </thead>
                        <tbody className="bg-background">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        Memuat data user...
                                    </td>
                                </tr>
                            ) : allUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        Tidak ada data user yang tersedia.
                                    </td>
                                </tr>
                            ) : (
                                allUsers.map((user) => (
                                    <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">{user.name}</td>
                                        <td className="px-4 py-3">{user.username}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <RoleLabel role={user.role} />
                                        </td>
                                        <td className="px-4 py-3 flex justify-center sm:justify-start gap-3">
                                            <button 
                                                onClick={() => handleEditUser(user)}
                                                className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-blue-500 hover:bg-blue-50"
                                                title="Edit User"
                                            >
                                                <MdEdit className="w-5 h-5"/>
                                            </button>
                                            <button 
                                                onClick={() => openDeleteConfirm(user)}
                                                className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-red-500 hover:bg-red-50"
                                                title="Delete User"
                                            >
                                                <MdDelete className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            <AddUser
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                onSave={handleSaveUser}
            />
            <EditUser
                isOpen={isEditUserOpen}
                onClose={() => { setIsEditUserOpen(false); setEditUserData(null); }}
                userData={editUserData}
                onSave={handleSaveEditUser}
            />
            <DeleteConfirmation
                deleted={deleteConfirm.user?.name || ""}
                open={deleteConfirm.open}
                onConfirm={confirmDeleteUser}
                onCancel={closeDeleteConfirm}
            />
        </>
    );
};

export default UserTable;