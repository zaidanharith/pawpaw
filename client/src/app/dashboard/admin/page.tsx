"use client";
import { useState } from "react";
import RoleNavbar from "@/components/layout/RoleNavbar";

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Fungsi render konten berdasarkan menu aktif
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <div className="space-y-6 w-full mx-4 md:mx-8 lg:mx-10">
            {/* Weather Section */}
            <div className="bg-white border-2 h-32 md:h-40 rounded-xl flex items-center justify-center text-base md:text-lg font-semibold text-gray-600">
              Weather
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {[
                { label: "Siswa", count: 24, color: "#3f9065" },
                { label: "Guru", count: 6, color: "#3f9065" },
                { label: "Admin", count: 5, color: "#3f9065" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3 md:p-4 text-center flex flex-col border-2 justify-between"
                  style={{ backgroundColor: item.color }}
                >
                  <div>
                    <h3 className="text-2xl md:text-3xl text-white font-bold">
                      {item.count}
                    </h3>
                    <p className="text-xs md:text-sm text-white mt-1">
                      {item.label}
                    </p>
                  </div>
                  <button className="mt-3 md:mt-4 bg-[#fefaef] border-2 cursor-pointer text-gray-700 text-xs md:text-sm font-medium rounded-md px-2 py-1 md:px-3 md:py-1 hover:bg-gray-100 transition">
                    Kelola {item.label}
                  </button>
                </div>
              ))}
            </div>

            {/* Laporan Terkini */}
            <section className="bg-gray-50 border-2 rounded-xl p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h2 className="font-semibold text-base md:text-lg">
                  Laporan Terkini
                </h2>
                <button className="bg-[#3f9065] border-2 border-gray-800 text-white cursor-pointer px-2 py-1 md:px-3 md:py-1 rounded-md text-xs md:text-sm hover:bg-[#347b56] transition w-full sm:w-auto">
                  Kelola Live Report
                </button>
              </div>
              <div className="space-y-2 md:space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-md shadow-sm border"
                  >
                    <div className="bg-yellow-100 p-1 md:p-2 rounded-md text-yellow-600 font-bold text-xs md:text-sm">
                      🗂
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">
                        Senam Pagi
                      </p>
                      <p className="text-xs text-gray-500 truncate">AYO SEHAT!!!</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pengumuman Terkini */}
            <section className="bg-gray-50 border-2 rounded-xl p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h2 className="font-semibold text-base md:text-lg">
                  Pengumuman Terkini
                </h2>
                <button className="bg-[#3f9065] border-2 border-gray-800 text-white cursor-pointer px-2 py-1 md:px-3 md:py-1 rounded-md text-xs md:text-sm hover:bg-[#347b56] transition w-full sm:w-auto">
                  Kelola Pengumuman
                </button>
              </div>
              <div className="space-y-2 md:space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-md shadow-sm border"
                  >
                    <div className="bg-yellow-100 p-1 md:p-2 rounded-md text-yellow-600 font-bold text-xs md:text-sm">
                      🔔
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">
                        Senam Pagi
                      </p>
                      <p className="text-xs text-gray-500 truncate">AYO SEHAT!!!</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
    <div className="relative min-h-screen flex flex-col">
      <RoleNavbar role="Admin" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="flex-1 flex justify-center items-start py-6 sm:mt-2 md:mt-4">
        {renderContent()}
      </main>
    </div>
  );
}
