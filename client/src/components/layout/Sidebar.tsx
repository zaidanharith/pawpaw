"use client";
import React, { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Simpan nama menu yang sedang aktif
  const [activeMenu, setActiveMenu] = useState<string>("");

  const handleClick = (menu: string) => {
    setActiveMenu(menu);
    onClose(); // opsional: tutup sidebar setelah klik
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* Overlay */}
      <div
        className={`inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`top-0 left-0 h-full w-64 bg-[#2E6F4D] shadow-lg p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="self-end text-white hover:text-gray-200 text-2xl mb-4 cursor-pointer"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          &times;
        </button>

        {/* Isi menu sidebar */}
        <nav className="flex flex-col gap-4">
          {["Dashboard", "User", "Siswa", "Laporan Kegiatan", "Pengumuman" ].map((menu) => (
            <button
              key={menu}
              onClick={() => handleClick(menu)}
              className={`font-semibold rounded-sm py-2 transition-all duration-200 cursor-pointer ${
                activeMenu === menu
                  ? "bg-white text-[#2E6F4D]"
                  : "border-2 border-white text-white hover:bg-white hover:text-[#2E6F4D]"
              }`}
            >
              {menu}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
