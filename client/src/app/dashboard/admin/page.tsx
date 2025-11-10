export default function AdminDashboardPage() {
  return (
    <div>
        {/* Main Content */}
        <main className="flex-1 flex justify-center items-start">
                <div className="space-y-8 w-full mx-20">
                    {/* Weather Section */}
                    <div className="bg-white border h-40 rounded-xl flex items-center justify-center text-lg font-semibold text-gray-600">
                        Weather
                    </div>

                    {/* Statistik Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Siswa", count: 24, color: "#3f9065" },
                            { label: "Guru", count: 6, color: "#3f9065" },
                            { label: "Admin", count: 5, color: "#3f9065" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="rounded-xl p-4 text-center flex flex-col justify-between"
                                style={{ backgroundColor: item.color }}
                            >
                                <div>
                                    <h3 className="text-3xl text-white font-bold">{item.count}</h3>
                                    <p className="text-sm text-white mt-1">{`${item.label}`}</p>
                                </div>
                                <button className="mt-4 bg-white text-gray-700 text-sm font-medium rounded-md px-3 py-1 hover:bg-gray-100 transition">
                                    Kelola {item.label}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Laporan Terkini */}
                    <section className="bg-gray-50 border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg">Laporan Terkini</h2>
                            <button className="bg-[#3f9065] text-white px-3 py-1 rounded-md text-sm hover:bg-[#347b56] transition">
                                Kelola Live Report
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border">
                                    <div className="bg-yellow-100 p-2 rounded-md text-yellow-600 font-bold text-sm">
                                        🗂
                                    </div>
                                    <div>
                                        <p className="font-medium">Senam Pagi</p>
                                        <p className="text-xs text-gray-500">AYO SEHAT!!!</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-4">
                            <button className="bg-[#3f9065] text-white px-4 py-1 rounded-md text-sm hover:bg-[#347b56] transition">
                                Lihat Selengkapnya
                            </button>
                        </div>
                    </section>

                    {/* Pengumuman Terkini */}
                    <section className="bg-gray-50 border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg">Pengumuman Terkini</h2>
                            <button className="bg-[#3f9065] text-white px-3 py-1 rounded-md text-sm hover:bg-[#347b56] transition">
                                Kelola Pengumuman
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border">
                                    <div className="bg-yellow-100 p-2 rounded-md text-yellow-600 font-bold text-sm">
                                        🔔
                                    </div>
                                    <div>
                                        <p className="font-medium">Senam Pagi</p>
                                        <p className="text-xs text-gray-500">AYO SEHAT!!!</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-4">
                            <button className="bg-[#3f9065] text-white px-4 py-1 rounded-md text-sm hover:bg-[#347b56] transition">
                                Lihat Selengkapnya
                            </button>
                        </div>
                    </section>
                </div>
        </main>
    </div>
  );
}
