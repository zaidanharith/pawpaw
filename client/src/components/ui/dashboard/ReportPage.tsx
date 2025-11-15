import React from "react";
import { FaEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const ReportPage: React.FC = () => {
    const { data: session } = useSession();
    const role = session?.user?.role || "ADMIN";
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

    return (
        <>
            <section>
                <div
                    className="
                        flex flex-col gap-3 
                        sm:flex-row sm:items-center sm:justify-between
                    "
                >
                    <div className="flex flex-row items-center gap-2 px-4 bg-white border-[#3f9065] border rounded-lg w-full sm:w-auto">
                        <div className="bg-[#3f9065] text-white rounded-lg px-3 py-2 my-2 flex flex-col items-center">
                            <h3 className="font-semibold text-md">Senin</h3>
                            <h4 className="font-normal text-sm">2 November 2025</h4>
                        </div>
                        <div className="text-gray-800 px-3 py-2 flex flex-col items-center">
                            <h3 className="font-semibold text-sm">Total Laporan Hari Ini</h3>
                            <h4 className="font-bold text-3xl">9</h4>
                        </div>
                    </div>

                    <button
                        className="
                            w-full sm:w-auto
                            flex items-center justify-center gap-2 
                            px-4 py-3 cursor-pointer 
                            rounded-lg text-sm md:text-base font-semibold 
                            hover:shadow-lg transition
                        "
                        style={{
                            backgroundColor: accentColor,
                            color: textColor,
                        }}
                    >
                        <FaEdit /> Buat Laporan
                    </button>
                </div>
            </section>

            <section>
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <button
                            key={i}
                            className="
                                flex items-center gap-3 
                                p-3 rounded-lg shadow 
                                hover:shadow-md border
                                transition cursor-pointer
                            "
                            style={{
                                borderColor: accentColor,
                                backgroundColor: "#fff",
                            }}
                        >
                            <div
                                className="
                                    p-2 rounded-lg font-bold text-lg 
                                    flex items-center justify-center
                                "
                                style={{ backgroundColor: accentColor, color: "#fff" }}
                            >
                                🗂
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                                <p className="font-semibold md:text-lg truncate">
                                    Senam Pagi
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    AYO SEHAT!!!
                                </p>
                            </div>

                            <span
                                className="
                                    text-xs text-gray-500 
                                    bg-gray-200 px-2 py-1 rounded-lg ml-2 font-bold
                                "
                            >
                                07:30
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </>
    );
};

export default ReportPage;
