"use client";
import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bgColor = roleColors[role.toLowerCase()] || "#3f9065";

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
      />

      <nav
        
        style={{ backgroundColor: bgColor }}
      >
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="px-3 py-1 rounded-md text-white cursor-pointer bg-opacity-20 hover:bg-opacity-30 transition flex items-center justify-center"
        >
          <Image src="/burger.svg" alt="Menu" width={20} height={20} />
        </button>
      </nav>
    </>
  );
}
