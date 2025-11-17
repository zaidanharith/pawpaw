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

interface StatisticsProps {
    onNavigateToUser?: () => void;
    onNavigateToSiswa?: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ 
    onNavigateToUser, 
    onNavigateToSiswa 
}) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const role = session?.user?.role || "ADMIN";
    const cardColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "TEACHER" ? "#282828" : "#fff";
    const token = session?.accessToken;

    const [studentCount, setStudentCount] = useState<number>(0);
    const [teacherCount, setTeacherCount] = useState<number>(0);
    const [adminCount, setAdminCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchStats = async () => {
            // Wait for session to load
            if (status === "loading") {
                return;
            }

            // If not authenticated, redirect to login
            if (status === "unauthenticated") {
                console.log("❌ User not authenticated");
                router.push("/login");
                return;
            }

            if (!token) {
                console.error("❌ No access token found in session");
                console.log("Session data:", session);
                setError("Token tidak ditemukan. Silakan login ulang.");
                setLoading(false);
                return;
            }

            console.log("=== Fetch Statistics Started ===");
            console.log("API URL:", API_URL);
            console.log("Token preview:", token.substring(0, 30) + "...");

            setLoading(true);
            setError("");

            try {
                // Fetch Students
                const resStudent = await fetch(`${API_URL}/student`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                });
                
                console.log("Student API Status:", resStudent.status);
                
                if (resStudent.status === 401) {
                    console.error("❌ 401 Unauthorized - Token invalid/expired");
                    setError("Sesi Anda telah berakhir. Silakan login ulang.");
                    setTimeout(() => {
                        signOut({ callbackUrl: "/login" });
                    }, 2000);
                    return;
                }

                if (!resStudent.ok) {
                    const errorText = await resStudent.text();
                    console.error("Student API error:", errorText);
                    throw new Error(`Student API: ${resStudent.status}`);
                }
                
                const dataStudent = await resStudent.json();
                console.log("✅ Student Response:", dataStudent);
                
                // Handle different response structures
                let count = 0;
                if (typeof dataStudent.count === 'number') {
                    count = dataStudent.count;
                } else if (dataStudent.data && Array.isArray(dataStudent.data)) {
                    count = dataStudent.data.length;
                } else if (Array.isArray(dataStudent)) {
                    count = dataStudent.length;
                } else if (dataStudent.success && dataStudent.data) {
                    if (Array.isArray(dataStudent.data)) {
                        count = dataStudent.data.length;
                    } else if (typeof dataStudent.data === 'number') {
                        count = dataStudent.data;
                    }
                }
                setStudentCount(count);
                console.log("📊 Student count:", count);

                // Fetch Users
                const resUser = await fetch(`${API_URL}/user`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                });
                
                console.log("User API Status:", resUser.status);
                
                if (resUser.status === 401) {
                    console.error("❌ 401 Unauthorized - Token invalid/expired");
                    setError("Sesi Anda telah berakhir. Silakan login ulang.");
                    setTimeout(() => {
                        signOut({ callbackUrl: "/login" });
                    }, 2000);
                    return;
                }

                if (!resUser.ok) {
                    const errorText = await resUser.text();
                    console.error("User API error:", errorText);
                    throw new Error(`User API: ${resUser.status}`);
                }
                
                const dataUser = await resUser.json();
                console.log("✅ User Response:", dataUser);
                
                let users: User[] = [];
                
                if (dataUser.success && Array.isArray(dataUser.data)) {
                    users = dataUser.data;
                } else if (Array.isArray(dataUser)) {
                    users = dataUser;
                } else if (dataUser.data && Array.isArray(dataUser.data)) {
                    users = dataUser.data;
                }

                const teacherCnt = users.filter((u) => u.role === "TEACHER").length;
                const adminCnt = users.filter((u) => u.role === "ADMIN").length;
                
                setTeacherCount(teacherCnt);
                setAdminCount(adminCnt);

                console.log("=== Statistics Summary ===");
                console.log("📊 Students:", count);
                console.log("📊 Teachers:", teacherCnt);
                console.log("📊 Admins:", adminCnt);
                
            } catch (error) {
                console.error("❌ Failed to fetch statistics:", error);
                setError("Gagal mengambil data statistik");
                setStudentCount(0);
                setTeacherCount(0);
                setAdminCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token, status, router, session]);

    const handleManage = (type: "siswa" | "guru" | "admin") => {
        if (type === "siswa" && onNavigateToSiswa) {
            onNavigateToSiswa();
        } else if ((type === "guru" || type === "admin") && onNavigateToUser) {
            onNavigateToUser();
        }
    };

    const stats = [
        { 
            label: "Siswa", 
            count: studentCount, 
            icon: "👨‍🎓",
            type: "siswa" as const,
        },
        { 
            label: "Guru", 
            count: teacherCount, 
            icon: "👩‍🏫",
            type: "guru" as const
        },
        { 
            label: "Admin", 
            count: adminCount, 
            icon: "🛡️",
            type: "admin" as const
        },
    ];

    if (error) {
        return (
            <section className="flex gap-2 justify-between">
                <div className="w-full p-6 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-center font-semibold">⚠️ {error}</p>
                    <button 
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                        Login Ulang
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="flex gap-2 justify-between">
            {stats.map((item, i) => (
                <div 
                    key={i} 
                    className="rounded-xl shadow p-5 flex flex-col items-center transition w-1/3"
                    style={{ backgroundColor: cardColor }}
                >
                    <div className="mb-3 text-4xl">{item.icon}</div>
                    
                    <h3 
                        className="text-3xl md:text-4xl font-extrabold"
                        style={{ color: textColor }}
                    >
                        {loading ? (
                            <span className="animate-pulse">-</span>
                        ) : (
                            item.count
                        )}
                    </h3>
                    
                    <p 
                        className="text-sm md:text-base mt-2 font-semibold tracking-wide"
                        style={{ color: textColor }}
                    >
                        {item.label}
                    </p>
                    
                    <button 
                        onClick={() => handleManage(item.type)}
                        className="mt-5 cursor-pointer text-sm font-bold rounded-lg px-3 py-1 hover:shadow-md transition-all"
                        style={{
                            backgroundColor: "#fefaef",
                            borderColor: cardColor,
                            color: "#282828",
                        }}
                        title={`Kelola ${item.label}`}
                    >
                        Kelola
                    </button>
                </div>
            ))}
        </section>
    );
};

export default Statistics;