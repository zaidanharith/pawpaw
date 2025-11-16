"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { 
  DashboardPageTitle, 
  Weather, 
  LiveReport, 
  Announcement, 
  Profile, 
  ReportPage,
  MenuNotFound
} from "@/components/ui/dashboard";

import { 
  FaTachometerAlt, 
  FaClipboardList, 
  FaBullhorn, 
  FaUserCog, 
  FaRegSmile, 
  FaComments 
} from "react-icons/fa";

import FaceRegister from "../ui/dashboard/FaceRegister";
import ParentChat from "../ui/dashboard/ParentChat";

interface ParentProps {
  activePage?: string;
}

export default function Parent({ activePage = "" }: ParentProps) {
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", urlName: "", icon: <FaTachometerAlt size={24} /> },
    { name: "Laporan Kegiatan", urlName: "report", icon: <FaClipboardList size={24} /> },
    { name: "Pengumuman", urlName: "announcement", icon: <FaBullhorn size={24} /> },
    { name: "Chat Guru", urlName: "chat", icon: <FaComments size={24} /> },
    { name: "Profil", urlName: "profile", icon: <FaUserCog size={24} /> },
    { name: "Face Recognition", urlName: "face-recognition", icon: <FaRegSmile size={24} /> },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(activePage);

  useEffect(() => {
    setActiveMenu(activePage);
  }, [activePage]);

  const handleSelectMenu = (menuUrl: string) => {
    setActiveMenu(menuUrl);
    router.push(`/dashboard/${menuUrl}`);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "":
        return (
          <>
            <DashboardPageTitle page="Dashboard" />
            <div className="space-y-6">
              <Weather />
              <Announcement />
              <LiveReport />
            </div>
          </>
        );
      case "report":
        return (
          <>
            <DashboardPageTitle page="Laporan Kegiatan" />
            <ReportPage />
          </>
        );
      case "announcement":
        return (
          <>
            <DashboardPageTitle page="Pengumuman" />
            <Announcement />
          </>
        );
      case "chat":
        return (
          <>
            <DashboardPageTitle page="Chat Guru" />
            <ParentChat />
          </>
        );
      case "profile":
        return (
          <>
            <DashboardPageTitle page="Profil" />
            <Profile />
          </>
        );
      case "face-recognition":
        return (
          <>
            <DashboardPageTitle page="Face Recognition" />
            <FaceRegister />
          </>
        );
      default:
        return <MenuNotFound page={activeMenu} />;
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
        onSelectMenu={handleSelectMenu}
      />
      {renderContent()}
    </section>
  );
}