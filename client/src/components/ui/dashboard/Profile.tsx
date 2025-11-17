"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import authService, { AuthResponse } from "@/services/auth.service";
import Image from "next/image";
import RoleLabel from "@/components/ui/dashboard/RoleLabel";
import EditProfile from "@/components/ui/dashboard/EditProfile"; // Import komponen EditProfile

type UserProfile = AuthResponse["user"] & {
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    isLogin?: boolean;
    provider?: string;
    emailVerified?: string;
    picture?: string;
};

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

export default function Profile() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const role = session?.user?.role || "ADMIN";
    const [user, setUser] = useState<UserProfile | null>(null);
    const accentColor = roleColors[role] || roleColors.ADMIN;
    const [error, setError] = useState<string | null>(null);

    // State untuk modal Edit Profile
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.accessToken) {
            fetchProfile();
        } else if (status !== "loading") {
            setLoading(false);
        }
    }, [session?.accessToken, status]);

    const fetchProfile = async () => {
        try {
            const res = await authService.getProfile(session?.accessToken ?? "");
            const userData = (res && typeof res === "object" && "data" in res) ? res.data : res;
            if (userData) {
                setUser(userData as UserProfile);
            } else {
                setUser(null);
                setError("Data profil tidak ditemukan");
            }
        } catch {
            setError("Gagal mengambil data profil");
        } finally {
            setLoading(false);
        }
    };

    // Handler untuk membuka modal
    const handleEditProfile = () => {
        setIsEditProfileOpen(true);
    };

    // Handler untuk menutup modal
    const handleCloseModal = () => {
        setIsEditProfileOpen(false);
    };

    // Handler setelah save berhasil - refresh data profil
    const handleSaveProfile = () => {
        fetchProfile(); // Refresh data profil dari server
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow flex items-center justify-center h-64">
                <span className="text-gray-500">Loading profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center h-64">
                <span className="text-red-500 mb-4">{error}</span>
                <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Dashboard
                </Link>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="p-5 bg-white rounded-xl shadow">
                <div className="flex flex-col items-center">
                    <Image
                        src={user.picture || "/images/default-profile.png"}
                        alt={user.name || "Profile"}
                        width={96}
                        height={96}
                        className="rounded-full border-4 shadow mb-4 object-cover"
                        style={{ borderColor: accentColor }}
                        priority
                    />
                    <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500 mb-2">{user.email}</p>
                    <RoleLabel role={user.role} />
                    {user.phoneNumber && (
                        <p className="mt-3 text-gray-700">No. HP: {user.phoneNumber}</p>
                    )}
                    {user.provider && (
                        <span className="mt-2 text-xs text-gray-400">
                            Provider: {user.provider}
                        </span>
                    )}
                    {user.isActive !== undefined && (
                        <span className={`mt-2 text-xs font-semibold ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                            Status: {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                    )}
                    {user.createdAt && (
                        <span className="mt-2 text-xs text-gray-400">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    )}

                    {/* Tombol Edit Profile */}
                    <button
                        onClick={handleEditProfile}
                        className="mt-6 px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg shadow-md hover:opacity-90 transition"
                        style={{ backgroundColor: accentColor, color: role === "ADMIN" ? "#FFFFFF" : "#3d3006" }}
                    >
                        Edit Profil
                    </button>
                </div>
            </div>

            {/* Modal Edit Profile */}
            <EditProfile
                isOpen={isEditProfileOpen}
                onClose={handleCloseModal}
                onSave={handleSaveProfile}
            />
        </>
    );
}