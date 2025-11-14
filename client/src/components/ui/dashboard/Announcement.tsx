import React from "react";
import { useSession } from "next-auth/react";
import { FaEdit } from "react-icons/fa";

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const announcements = [
    {
        title: "Senam Pagi",
        message: "AYO SEHAT!!!",
        icon: "🔔",
    },
    {
        title: "Libur Nasional",
        message: "Tanggal 17 Agustus, sekolah libur.",
        icon: "🎉",
    },
    {
        title: "Pengambilan Raport",
        message: "Jumat, 25 Juni di ruang kelas masing-masing.",
        icon: "📄",
    },
];

const Announcement: React.FC = () => {
    const { data: session } = useSession();
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

    return (
        <section className="bg-white rounded-xl shadow p-5">
            <div className="flex flex-row items-center justify-between gap-2 mb-4">
                <h2
                    className="font-bold text-xl"
                >
                    Pengumuman
                </h2>
                <button
                    className="cursor-pointer px-3 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-80 transition flex items-center justify-center"
                    style={{
                        backgroundColor: accentColor,
                        color: textColor,
                    }}
                >
                    <FaEdit />
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {announcements.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg shadow hover:shadow-md border cursor-pointer"
                        style={{ borderColor: accentColor, backgroundColor: "#fff" }}
                    >
                        <div
                            className="p-2 rounded-lg font-bold text-lg flex items-center justify-center"
                            style={{ backgroundColor: accentColor, color: textColor }}
                        >
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p
                                className="font-semibold md:text-lg truncate"
                            >
                                {item.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{item.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Announcement;