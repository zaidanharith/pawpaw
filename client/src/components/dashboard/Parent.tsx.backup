"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { 
  DashboardPageTitle, 
  AnnouncementPage 
} from "@/components/ui/dashboard";

import { 
  FaTachometerAlt,
  FaBullhorn,
  FaUserCog
} from "react-icons/fa";

export default function Parent() {

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt size={24} /> },
    { name: "Pengumuman", icon: <FaBullhorn size={24} /> },
    { name: "Profil", icon: <FaUserCog size={24} /> },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <>
            <DashboardPageTitle page={activeMenu}/>
            {/* Parent dashboard boleh simple saja */}
            <AnnouncementPage />
          </>
        );

      case "Pengumuman":
        return (
          <>
            <DashboardPageTitle page={activeMenu}/>
            <AnnouncementPage />
          </>
        );

      case "Profil":
        return (
          <>
            <DashboardPageTitle page={activeMenu}/>
            {/* Parent Profile Component */}
          </>
        );
    }
  };

  return (
    <section className="w-full flex flex-col gap-4 my-5">
      <Navbar setIsSidebarOpen={() => setIsSidebarOpen(true)} />
      <Sidebar
          menuItems={menuItems}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeMenu={activeMenu}
          onSelectMenu={setActiveMenu}
      />
      {renderContent()}
    </section>
  );
}