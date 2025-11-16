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
  AnnouncementPage, 
  Profile, 
  ReportPage,
  MenuNotFound,
  PreviewChat,
  FaceRegister,
  RecentMessage
} from "@/components/ui/dashboard";

import { 
  FaTachometerAlt, 
  FaClipboardList, 
  FaBullhorn, 
  FaUserCog, 
  FaRegSmile, 
  FaComments 
} from "react-icons/fa";


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
    { name: "Registrasi Wajah", urlName: "face-registration", icon: <FaRegSmile size={24} /> },
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
            <RecentMessage />
            <Weather />
            <Announcement />
            <LiveReport />
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
            <AnnouncementPage />
          </>
        );
      case "chat":
        return (
          <>

            <DashboardPageTitle page="Chat Guru" />
            <PreviewChat />
          </>
        );
      case "profile":
        return (
          <>
            <DashboardPageTitle page="Profil" />
            <Profile />
          </>
        );
      case "face-registration":
        return (
          <>
            <DashboardPageTitle page="Registrasi Wajah" />
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