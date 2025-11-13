"use client";
import React, { useState } from "react";
import authService from "@/services/auth.service";
import { signOut, useSession } from "next-auth/react";
import { FaTachometerAlt, FaUser, FaUsers, FaClipboardList, FaBullhorn, FaSignOutAlt, FaTimes } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  role?: "ADMIN" | "TEACHER" | "PARENT";
}

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt size={24} /> },
  { name: "User", icon: <FaUser size={24} /> },
  { name: "Siswa", icon: <FaUsers size={24} /> },
  { name: "Laporan Kegiatan", icon: <FaClipboardList size={24} /> },
  { name: "Pengumuman", icon: <FaBullhorn size={24} /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeMenu,
  onSelectMenu,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession();

  const handleClick = (menu: string) => {
    onSelectMenu(menu);
    onClose();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (session?.accessToken) {
      await authService.logout(session.accessToken);
    }
    await signOut({ callbackUrl: "/login" });
  };

  const role = session?.user?.role || "ADMIN";
  const sidebarBg = roleColors[role] || roleColors.ADMIN;

  const baseTextColor = role === "ADMIN" ? "#ffffff" : "#282828";

  return (
    <div className={`font-sans fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-all duration-800 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-0 shadow-2xl flex flex-col p-8 transition-all duration-800 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
        style={{ backgroundColor: sidebarBg }}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-bold" style={{ color: baseTextColor }}>Menu {role.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</span>
          <button className="hover:text-gray-200 text-2xl p-2 rounded transition cursor-pointer" style={{ color: baseTextColor }} onClick={onClose} aria-label="Close sidebar">
            <FaTimes size={28} />
          </button>
        </div>
        <nav className="flex flex-col gap-5">
          {menuItems.map((menu) => (
            <button
              key={menu.name}
              onClick={() => handleClick(menu.name)}
              style={{
                color: activeMenu === menu.name
                  ? "#282828"
                  : baseTextColor,
                backgroundColor: activeMenu === menu.name
                  ? "#fff"
                  : "transparent",
                borderColor: "#fff"
              }}
              className={`flex items-center gap-3 font-semibold rounded-xl py-3 px-4 transition-all duration-200 cursor-pointer text-lg ${
                activeMenu === menu.name
                  ? "shadow-sm"
                  : "border-2 hover:bg-white hover:text-[#282828]"
              }`}
            >
              {menu.icon}
              {menu.name}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`mt-8 w-full py-3 px-4 font-semibold rounded-lg shadow transition cursor-pointer flex items-center justify-center gap-2 ${
            isLoggingOut
              ? "bg-gray-400 text-gray-100 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}>
          {isLoggingOut ? (
            <span className="flex items-center gap-2 cursor-not-allowed">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
              </svg>
              Sedang Mengeluarkan ...
            </span>
          ) : (
            <>
              <FaSignOutAlt size={20} />
              Keluar
            </>
          )}
        </button>
      </aside>
    </div>
  );
};

export default Sidebar;
