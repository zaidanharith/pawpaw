"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import authService from "@/services/auth.service";

export default function DashboardPage() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (session?.accessToken) {
      await authService.logout(session.accessToken);
    }
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4 cursor-pointer"
      >
        Logout
      </button>
      <Link href="/" className="mt-4 font-medium block text-blue-500 hover:underline">
        Kembali ke Beranda
      </Link>
      <h2 className="text-xl">Selamat datang, {session?.user.name}</h2>
    </div>
  );
}