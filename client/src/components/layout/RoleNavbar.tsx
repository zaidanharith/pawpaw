"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar"; // pastikan path-nya benar

const roleColors: Record<string, string> = {
  admin: "#3f9065",
  teacher: "#f5bb00",
  parent: "#58baab",
};

export default function RoleNavbar({ role, activeMenu, setActiveMenu }: {
  role: string;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bgColor = roleColors[role.toLowerCase()] || "#3f9065";

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
      />

      {/* Navbar */}
      <nav
        className="px-4 py-3 flex justify-between items-center font-sans fixed inset-x-0 top-0 backdrop-blur-md z-40 w-full transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      >
        {/* Tombol menu kiri (buka sidebar) */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="px-3 py-1 rounded-md text-white cursor-pointer bg-opacity-20 hover:bg-opacity-30 transition flex items-center justify-center"
        >
          <Image src="/burger.svg" alt="Menu" width={20} height={20} />
        </button>

        {/* Teks tengah */}
        <h1 className="text-lg font-bold text-white">Halo, {role}</h1>

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
    </>
  );
}
