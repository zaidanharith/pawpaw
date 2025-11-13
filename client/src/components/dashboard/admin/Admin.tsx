"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Statistics from "./Statistics";
import Weather from "./Weather";
import LiveReport from "./LiveReport";
import Announcement from "./Announcement";

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

export default function Admin() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const { data: session } = useSession();
  const role = session?.user?.role || "ADMIN";

  const accentColor = roleColors[role];
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <div className="w-full flex flex-col gap-5">
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
          <div className="p-6  w-full mx-4 md:mx-8 lg:mx-10 rounded-xl bg-white border-2 border-gray-800">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-800">Daftar User</h1>
              <p className="text-gray-600 font-normal text-sm">Seluruh daftar user</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-4">
              {["Admin", "Guru", "Orang Tua"].map((role) => (
                <button
                  key={role}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    role === "Admin"
                      ? "bg-[#3f9065] text-white"
                      : "bg-white text-gray-700 border hover:bg-gray-50"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Search + Add */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <input
                type="text"
                placeholder="Cari user"
                className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
              />
              <button className="flex items-center gap-2 bg-[#3f9065] text-white px-4 py-2 rounded-md hover:bg-[#347b56] transition text-sm font-medium">
                ➕ Tambah User
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-[#fdf9ef] text-gray-600 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Nama</th>
                    <th className="px-4 py-3 text-left font-semibold">Username</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">Cell Content</td>
                      <td className="px-4 py-3">Cell Content</td>
                      <td className="px-4 py-3">email@gmail.com</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button title="Lihat" className="text-[#3f9065] hover:text-[#347b56]">👁️</button>
                        <button title="Edit" className="text-blue-500 hover:text-blue-600">✏️</button>
                        <button title="Hapus" className="text-red-500 hover:text-red-600">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Siswa":
        return <div className="text-center text-gray-700">👩‍🎓 Data Siswa</div>;
      case "Laporan Kegiatan":
        return <div className="text-center text-gray-700">📝 Laporan Kegiatan</div>;
      case "Pengumuman":
        return <div className="text-center text-gray-700">📢 Pengumuman</div>;
      default:
        return <div className="text-center text-gray-700">🏠 Dashboard Admin</div>;
    }
  };

  return (
    <main className="flex-1 flex justify-center items-start py-6 sm:mt-2 md:mt-4">
      {renderContent()}
    </main>
  );
}
