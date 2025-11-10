"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

// Warna per role
const roleColors: Record<string, string> = {
  admin: "#3f9065",
  teacher: "#f5bb00",
  parent: "#58baab",
};

export default function RoleNavbar({ role }: { role: string }) {
  const { data: session } = useSession();
  const bgColor = roleColors[role.toLowerCase()] || "#3f9065"; // default admin kalau role gak dikenali

  return (
    <nav
      className="px-4 py-3 flex justify-between items-center font-sans fixed inset-x-0 top-0 backdrop-blur-md z-50 w-full transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {/* Tombol menu kiri */}
      <button
        className="px-3 py-1 rounded-md text-white bg-opacity-20 hover:bg-opacity-30 transition"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        Menu
      </button>

      {/* Teks tengah */}
      <h1 className="text-lg font-bold text-white">Halo {role}</h1>

      {/* Tombol profil kanan */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
          <Image
            src={session?.user?.image || "/default-profile.png"}
            alt={session?.user?.name || "Profile"}
            width={40}
            height={40}
            className="rounded-full object-cover"
            priority
          />
        </div>
      </Link>
    </nav>
  );
}
