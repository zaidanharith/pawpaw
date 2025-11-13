import React from "react";
import { useSession } from "next-auth/react";

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const LiveReport: React.FC = () => {
    const { data: session } = useSession();
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

    return (
        <section className="bg-white rounded-xl shadow p-5">
            <div className="flex flex-row items-center justify-between gap-2 mb-4">
                <h2
                    className="font-bold text-xl tracking-wide"
                >
                    Laporan Terkini
                </h2>
                <button
                    className="cursor-pointer px-3 py-2 rounded-lg text-sm md:text-base font-semibold hover:bg-opacity-80 transition"
                    style={{
                        backgroundColor: accentColor,
                        color: textColor,
                    }}
                >
                    Kelola Live Report
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                    <button
                        key={i}
                        className="flex items-center cursor-pointer gap-3 p-3 rounded-lg shadow hover:shadow-md border"
                        style={{ borderColor: accentColor, backgroundColor: "#fff" }}
                    >
                        <div
                            className="p-2 rounded-lg font-bold text-lg flex items-center justify-center"
                            style={{ backgroundColor: accentColor, color: "#fff" }}
                        >
                            🗂
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p
                                className="font-semibold md:text-lg truncate"
                            >
                                Senam Pagi
                            </p>
                            <p className="text-xs text-gray-500 truncate">AYO SEHAT!!!</p>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-lg ml-2 font-bold">
                            07:30
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default LiveReport;