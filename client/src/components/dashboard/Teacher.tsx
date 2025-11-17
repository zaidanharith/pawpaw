"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  DashboardPageTitle,
  Statistics,
  Weather,
  LiveReport,
  Announcement,
  Profile,
  StudentTable,
  ReportPage,
  AnnouncementPage,
  MenuNotFound,
  PreviewChat,
  QuarterlyReportPage,
} from "@/components/ui/dashboard";

import { 
  FaTachometerAlt, 
  FaUsers, 
  FaClipboardList, 
  FaBullhorn, 
  FaUserCog, 
  FaRegSmile,
  FaComments
} from "react-icons/fa";

import FaceRegister from "../ui/dashboard/FaceRegister";

interface TeacherProps {
  activePage?: string;
}

export default function Teacher({ activePage = "" }: TeacherProps) {
  const router = useRouter();
  
  // Role colors
  const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
  };
  
  const accentColor = roleColors.TEACHER || "#f5bb00";
  const textColor = "#3d3006";
  const isParent = false;
  
  const menuItems = [
    { name: "Dashboard", urlName: "", icon: <FaTachometerAlt size={24} /> },
    { name: "Siswa", urlName: "student", icon: <FaUsers size={24} /> },
    { name: "Laporan Kegiatan", urlName: "report", icon: <FaClipboardList size={24} /> },
    { name: "Laporan Triwulan", urlName: "quarterly-report", icon: <FaClipboardList size={24} /> },
    { name: "Pengumuman", urlName: "announcement", icon: <FaBullhorn size={24} /> },
    { name: "Chat Orang Tua Murid", urlName: "chat", icon: <FaComments size={24} /> },
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
            <Weather />
            <Statistics />
            <LiveReport />
            <Announcement />
          </>
        );
      case "student":
        return (
          <>
            <DashboardPageTitle page="Siswa" />
            <StudentTable />
          </>
        );
      case "report":
        return (
          <>
            <DashboardPageTitle page="Laporan Kegiatan" />
            <ReportPage />
          </>
        );
      case "quarterly-report":
        return (
          <>
            <DashboardPageTitle page="Laporan Triwulan" />
            <QuarterlyReportPage accentColor={accentColor} textColor={textColor} isParent={isParent} />
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
            <DashboardPageTitle page="Chat Orang Tua Murid" />
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
    <section className="w-full flex flex-col my-5">
      <Navbar setIsSidebarOpen={() => setIsSidebarOpen(true)} />
      <div className="md:flex md:flex-row md:gap-4">
        <div>
          <Sidebar
            menuItems={menuItems}
            isOpen={
              isSidebarOpen ||
              (typeof window !== "undefined" && window.innerWidth >= 768)
            }
            onClose={() => {
              if (typeof window === "undefined") return;
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            activeMenu={activeMenu}
            onSelectMenu={handleSelectMenu}
          />
        </div>
        <div className="flex flex-col gap-3 md:gap-4 flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </section>
  );
}