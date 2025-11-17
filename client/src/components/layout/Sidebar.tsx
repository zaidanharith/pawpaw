"use client";
import React, { useState } from "react";
import authService from "@/services/auth.service";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt, FaTimes} from "react-icons/fa";

interface SidebarProps {
  menuItems: { name: string; urlName: string; icon: React.ReactNode }[];
  isOpen: boolean;
  onClose: () => void;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
}

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  isOpen,
  onClose,
  activeMenu,
  onSelectMenu,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession();

  const handleClick = (menuUrl: string) => {
    onSelectMenu(menuUrl);
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
    <div className={`font-sans fixed inset-0 z-100 transition-all duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"} md:static`}>
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-all duration-800 ${isOpen ? "opacity-100" : "opacity-0"} md:static`}
        onClick={onClose}/>
      <aside
        className={`absolute inset-0 shadow-2xl flex flex-col p-8 md:px-6 transition-all duration-800 ease-in-out h-full overflow-y-auto ${isOpen ? "translate-y-0" : "-translate-y-full"} md:static md:shadow-none md:rounded-xl md:h-auto lg:min-w-xs`}
        style={{ backgroundColor: sidebarBg }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-bold" style={{ color: baseTextColor }}>Menu {role.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</span> 
          <button className="hover:text-gray-200 text-2xl p-2 rounded transition cursor-pointer md:hidden" style={{ color: baseTextColor }} onClick={onClose} aria-label="Close sidebar">
            <FaTimes size={28} />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          {menuItems.map((menu) => (
            <button
              key={menu.urlName}
              onClick={() => handleClick(menu.urlName)}
              style={{
                color: activeMenu === menu.urlName
                  ? "#282828"
                  : baseTextColor,
                backgroundColor: activeMenu === menu.urlName
                  ? "#fff"
                  : "transparent",
                borderColor: "#fff"
              }}
              className={`flex items-center gap-3 font-semibold rounded-xl py-2 px-3 transition-all duration-200 cursor-pointer text-lg ${
                activeMenu === menu.urlName
                  ? "shadow-sm"
                  : "border-2 hover:bg-white hover:text-[#282828]"
              } md:text-base md:gap-2 md:rounded-lg`}
            >
              {menu.icon}
              {menu.name}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`mt-8 mb-2 w-full py-3 px-4 font-semibold rounded-lg shadow transition cursor-pointer flex items-center justify-center gap-2 ${
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
