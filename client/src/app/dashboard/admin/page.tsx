'use client';

import { useState } from 'react';


export default function AdminDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div>
        {/* Main Content */}
        <main className="flex-1 flex justify-center items-start">
                <div className="space-y-6 w-full mx-4 md:mx-8 lg:mx-20">
                    {/* Weather Section */}
                    <div className="bg-white border h-32 md:h-40 rounded-xl flex items-center justify-center text-base md:text-lg font-semibold text-gray-600">
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
                                className="rounded-xl p-3 md:p-4 text-center flex flex-col justify-between"
                                style={{ backgroundColor: item.color }}
                            >
                                <div>
                                    <h3 className="text-2xl md:text-3xl text-white font-bold">{item.count}</h3>
                                    <p className="text-xs md:text-sm text-white mt-1">{`${item.label}`}</p>
                                </div>
                                <button className="mt-3 md:mt-4 bg-[#fefaef] cursor-pointer text-gray-700 text-xs md:text-sm font-medium rounded-md px-2 py-1 md:px-3 md:py-1 hover:bg-gray-100 transition">
                                    Kelola {item.label}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Laporan Terkini */}
                    <section className="bg-gray-50 border rounded-xl p-3 md:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                            <h2 className="font-semibold text-base md:text-lg">Laporan Terkini</h2>
                            <button className="bg-[#3f9065] text-white cursor-pointer px-2 py-1 md:px-3 md:py-1 rounded-md text-xs md:text-sm hover:bg-[#347b56] transition w-full sm:w-auto">
                                Kelola Live Report
                            </button>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-md shadow-sm border">
                                    <div className="bg-yellow-100 p-1 md:p-2 rounded-md text-yellow-600 font-bold text-xs md:text-sm">
                                        🗂
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm md:text-base truncate">Senam Pagi</p>
                                        <p className="text-xs text-gray-500 truncate">AYO SEHAT!!!</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-3 md:mt-4">
                            <button className="bg-[#3f9065] text-white cursor-pointer px-3 py-1 md:px-4 md:py-1 rounded-md text-xs md:text-sm hover:bg-[#347b56] transition w-full sm:w-auto">
                                Lihat Selengkapnya
                            </button>
                        </div>
                    </section>

                    {/* Pengumuman Terkini */}
                    <section className="bg-gray-50 border rounded-xl p-3 md:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                            <h2 className="font-semibold text-base md:text-lg">Pengumuman Terkini</h2>
                            <button className="bg-[#3f9065] text-white cursor-pointer px-2 py-1 md:px-3 md:py-1 rounded-md text-xs md:text-sm hover:bg-[#347b56] transition w-full sm:w-auto">
                                Kelola Pengumuman
                            </button>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-md shadow-sm border">
                                    <div className="bg-yellow-100 p-1 md:p-2 rounded-md text-yellow-600 font-bold text-xs md:text-sm">
                                        🔔
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm md:text-base truncate">Senam Pagi</p>
                                        <p className="text-xs text-gray-500 truncate">AYO SEHAT!!!</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-3 md:mt-4">
                            <button className="bg-[#3f9065] text-white cursor-pointer not-[]:px-3 py-1 md:px-4 md:py-1 rounded-md text-xs md:text-sm hover:bg-[#347b56] transition w-full sm:w-auto">
                                Lihat Selengkapnya
                            </button>
                        </div>
                    </section>
                </div>
        </main>
    </div>
  );
}