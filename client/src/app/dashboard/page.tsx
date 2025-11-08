"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/dist/client/link";
import Navbar from "../../components/layout/Navbar";

const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };
  
export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <Navbar></Navbar>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4"
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