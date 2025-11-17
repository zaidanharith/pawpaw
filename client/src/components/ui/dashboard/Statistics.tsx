import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

type User = {
    id: string;
    name: string;
    role: "ADMIN" | "TEACHER" | "PARENT";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Statistics: React.FC = () => {
    const { data: session } = useSession();
    const role = session?.user?.role || "ADMIN";
    const cardColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "TEACHER" ? "#282828" : "#fff";

    const [studentCount, setStudentCount] = useState<number>(0);
    const [teacherCount, setTeacherCount] = useState<number>(0);
    const [adminCount, setAdminCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const resStudent = await fetch(`${API_URL}/student`, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken || ""}`,
                    },
                });
                const dataStudent = await resStudent.json();
                setStudentCount(dataStudent.count || 0);

                const resUser = await fetch(`${API_URL}/user`, {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken || ""}`,
                    },
                });

                const dataUser = await resUser.json();
                if (dataUser.success && Array.isArray(dataUser.data)) {
                    const users: User[] = dataUser.data;
                    setTeacherCount(users.filter((u) => u.role === "TEACHER").length);
                    setAdminCount(users.filter((u) => u.role === "ADMIN").length);
                }
            } catch {
                setStudentCount(0);
                setTeacherCount(0);
                setAdminCount(0);
            }
            setLoading(false);
        };
        if (session?.accessToken) fetchStats();
    }, [session?.accessToken]);

    const stats = [
        { label: "Siswa", count: studentCount, icon: "👨‍🎓" },
        { label: "Guru", count: teacherCount, icon: "👩‍🏫" },
        { label: "Admin", count: adminCount, icon: "🛡️" },
    ];

    return (
        <section className="flex gap-2 justify-between">
            {stats.map((item, i) => (
                <div key={i} className="rounded-xl shadow p-5 flex flex-col items-center transition w-1/3"
                    style={{ backgroundColor: cardColor }} >
                    <div className="mb-3 text-4xl">{item.icon}</div>
                    <h3  className="text-3xl md:text-4xl font-extrabold"
                        style={{ color: textColor }} >
                        {loading ? <span className="animate-pulse">-</span> : item.count}
                    </h3>
                    <p className="text-sm md:text-base mt-2 font-semibold tracking-wide"
                        style={{ color: textColor }}>
                        {item.label}
                    </p>
                    <button className="mt-5 cursor-pointer text-sm font-bold rounded-lg px-3 py-1"
                        style={{
                            backgroundColor: "#fefaef",
                            borderColor: cardColor,
                            color: "#282828",
                        }} >
                        Kelola
                    </button>
                </div>
            ))}
        </section>
    );
};

export default Statistics;