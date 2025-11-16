"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { DashboardPageTitle, Statistics, Weather, LiveReport, Announcement, Profile, UserTable, StudentTable, ReportPage, AnnouncementPage, ClassPage, ResetPassword, MenuNotFound } from "@/components/ui/dashboard";
import { FaTachometerAlt, FaUser, FaUsers, FaClipboardList, FaBullhorn, FaUserCog, FaRegSmile, } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import FaceRegister from "../ui/dashboard/FaceRegister";

interface AdminProps {
  activePage?: string;
}

export default function Admin({ activePage = "" }: AdminProps) {
  const router = useRouter();
  const menuItems = [
    { name: "Dashboard", urlName: "", icon: <FaTachometerAlt size={24} /> },
    { name: "User", urlName: "user", icon: <FaUser size={24} /> },
    { name: "Siswa", urlName: "student", icon: <FaUsers size={24} /> },
    { name: "Kelas", urlName: "class", icon: <SiGoogleclassroom size={24} /> },
    { name: "Laporan Kegiatan", urlName: "report", icon: <FaClipboardList size={24} /> },
    { name: "Pengumuman", urlName: "announcement", icon: <FaBullhorn size={24} /> },
    { name: "Profil", urlName: "profile", icon: <FaUserCog size={24} /> },
    { name: "Face Registration", urlName: "face-registration", icon: <FaRegSmile size={24} /> },
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

  const handleNavigateToReport = () => {
    setActiveMenu("Laporan Kegiatan");
    
  };

  const handleNavigateToAnnouncement = () => {
    setActiveMenu("Pengumuman");
  };

    const handleNavigateToUser = () => {
    setActiveMenu("user");
    router.push("/dashboard/user");
};

    const handleNavigateToSiswa = () => {
    setActiveMenu("student");
    router.push("/dashboard/student");
};

  const renderContent = () => {
    switch (activeMenu) {
      case "":
        return (
          <>
            <DashboardPageTitle page="Dashboard"/>
            <Weather />
            <Statistics 
              onNavigateToUser={handleNavigateToUser}
              onNavigateToSiswa={handleNavigateToSiswa}
            />
            <LiveReport onNavigateToReport={handleNavigateToReport} />
            <Announcement onNavigateToAnnouncement={handleNavigateToAnnouncement} />
          </>
        );
      case "user":
        return (
          <>
            <DashboardPageTitle page="User"/>
            <UserTable  />
          </>
        );
      case "student":
        return (
          <>
            <DashboardPageTitle page="Siswa"/>
            <StudentTable />
          </>
        );
      case "class":
        return (
          <>
            <DashboardPageTitle page="Kelas"/>
            <ClassPage />
          </>
        );
      case "report":
        return (
          <>
            <DashboardPageTitle page="Laporan Kegiatan"/>
            <ReportPage />
          </>
        );
      case "announcement":
        return (
          <>
            <DashboardPageTitle page="Pengumuman"/>
            <AnnouncementPage />
          </>
        );
      case "profile":
        return (
          <>
            <DashboardPageTitle page="Profil"/>
            <ResetPassword />
            <Profile />
          </>
        );
      case "face-registration":
        return (
          <>
            <DashboardPageTitle page="Face Registration"/>
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