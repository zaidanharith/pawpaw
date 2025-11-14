import React from "react";
import { MdEdit, MdDelete } from "react-icons/md"

interface User {
    id: number;
    name: string;
    phoneNumber: string;
    username: string;
    email: string;
    password: string;
    role: string;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

interface TableUserProps {
    allUsers: User[];

    onEditUser: (user: User) => void; 
    onDeleteUser?: (userId: number) => void;
    activeRole: string; 
}

const TableUser: React.FC<TableUserProps> = ({ allUsers, onEditUser, onDeleteUser, activeRole }) => {
    
    return (
        <section className="bg-white rounded-lg shadow-lg p-0 border border-gray-100">
            <div className="bg-white rounded-lg overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-[#3f9065] text-gray-600 border-b">
                        <tr>
                            <th className="px-4 py-3 text-white text-left font-semibold whitespace-nowrap">Nama Lengkap</th>
                            <th className="px-4 py-3 text-white text-left font-semibold">Username</th>
                            <th className="px-4 py-3 text-white text-left font-semibold">Email</th>
                            <th className="px-4 py-3 text-white text-left font-semibold">Role</th>
                            <th className="px-4 py-3 text-white text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                    Tidak ada data user yang tersedia untuk role **{activeRole}**.
                                </td>
                            </tr>
                        ) : (
                            allUsers.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium whitespace-nowrap">{user.name}</td>
                                    <td className="px-4 py-3">{user.username}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase`} 
                                            style={{
                                                backgroundColor: roleColors[user.role.toUpperCase()] || roleColors.ADMIN, 
                                                color: user.role.toUpperCase() === "ADMIN" ? "#FFFFFF" : "#282828" 
                                            }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex justify-center sm:justify-start gap-3">
                                           <button 
                                            onClick={() => onEditUser(user)}
                                            className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-blue-500 hover:bg-blue-50"
                                            title="Edit User"
                                        >
                                            <MdEdit className="w-5 h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => onDeleteUser && onDeleteUser(user.id)}
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
    );
};

export default TableUser;