"use client"

import React, { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import authService  from "@/services/auth.service";
import { useEffect } from "react";

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

interface SessionUser {
    id: string;
    username: string;
    role: "ADMIN" | "TEACHER" | "PARENT";
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isPasswordReset?: boolean;
}

type UserProfile = {
    success?: string;
    data: {
        id?: string;
        username?: string;
        name?: string;
        email?: string;
        role?: "ADMIN" | "TEACHER" | "PARENT";
        picture?: string;
        phoneNumber?: string;
        provider?: string;
        emailVerified?: Date;
        isPasswordReset?: boolean;
    };
};

export default function ResetPassword() {
    const { data: session } = useSession();
    const user = session?.user as SessionUser;

    const role = user?.role || "ADMIN";
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [userDetail, setUserDetail] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.username) return;
            try {
                const res = await authService.getProfile(session?.accessToken ?? "");
                const userDetail = (res && typeof res === "object" && "data" in res) ? res.data : res;
                if (userDetail) {
                    setUserDetail(userDetail as UserProfile);
                } else {
                    setUserDetail(null);
                    setMessage("Data profil tidak ditemukan");
                }
            } catch {
                setUserDetail(null);
            }
        };
        fetchProfile();
    }, [user?.username, session?.accessToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (newPassword !== confirmPassword) {
            setMessage("Konfirmasi password tidak cocok.");
            return;
        }
        setLoading(true);
        try {
            const username = user?.username;
            const token = session?.accessToken;
            if (!username) {
                setMessage("Username tidak ditemukan.");
                setLoading(false);
                return;
            }
            const res = await authService.resetPassword(username, newPassword, token);
            setMessage(res.message || "Password berhasil direset.");

            await getSession({ triggerEvent: true });

        } catch {
            setMessage("Gagal reset password.");
        }
        setLoading(false);
    };

    if (userDetail?.isPasswordReset) return null;

    return (
        <section className="bg-white rounded-xl shadow p-5 border-2 border-red-500">
            <h2 className="text-xl font-bold mb-3">Reset Password</h2>
            <div className="bg-red-100 border border-red-500 px-3 py-2 rounded-md mb-4 text-red-600 font-semibold text-sm">
                Anda disarankan untuk mengganti password setelah pertama kali login.
                <pre>{JSON.stringify(userDetail, null, 2)}</pre>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Password Baru
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className={`w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:outline-none`}
                        style={{ 
                            boxShadow: loading ? undefined : undefined,
                            '--tw-ring-color': accentColor 
                        } as React.CSSProperties}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className={`w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:outline-none`}
                        style={{ 
                            boxShadow: loading ? undefined : undefined,
                            '--tw-ring-color': accentColor 
                        } as React.CSSProperties}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-white cursor-pointer hover:bg-opacity-80 transition"
                        style={{ backgroundColor: accentColor, color: textColor, opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Memproses..." : "Reset Password"}
                    </button>
                </div>
                {message && (
                    <div
                        className={`mt-3 text-center text-sm font-semibold ${
                            message.toLowerCase().includes("gagal") || message.toLowerCase().includes("tidak cocok") || message.toLowerCase().includes("tidak ditemukan")
                                ? "text-red-600"
                                : "text-green-600"
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </section>
    );
}