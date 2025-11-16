"use client";

import { useState } from "react";
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
} from "@/components/ui/dashboard";

import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaBullhorn,
  FaUserCog,
  FaRegSmile,
  FaComments,
} from "react-icons/fa";

import FaceRegister from "../ui/dashboard/FaceRegister";
import TeacherChat from "@/components/ui/dashboard/TeacherChat";

export default function Teacher() {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt size={24} /> },
    { name: "Siswa", icon: <FaUsers size={24} /> },
    { name: "Laporan Kegiatan", icon: <FaClipboardList size={24} /> },
    { name: "Pengumuman", icon: <FaBullhorn size={24} /> },
    { name: "Chat Orang Tua Murid", icon: <FaComments size={24} /> }, // 🔥 DIGANTI
    { name: "Profil", icon: <FaUserCog size={24} /> },
    { name: "Face Recognition", icon: <FaRegSmile size={24} /> },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <>
            <DashboardPageTitle page={activeMenu} />
            <Weather />
            <Statistics />
            <LiveReport />
            <Announcement />
          </>
        );

      case "Siswa":
        return (
          <>
            <DashboardPageTitle page={activeMenu} />
            <StudentTable />
          </>
        );

      case "Laporan Kegiatan":
        return (
          <>
            <DashboardPageTitle page={activeMenu} />
            <ReportPage />
          </>
        );

      case "Pengumuman":
        return (
          <>
            <DashboardPageTitle page={activeMenu} />
            <AnnouncementPage />
          </>
        );

      case "Chat Orang Tua Murid": 
        return (
          <>
            <DashboardPageTitle page={activeMenu} />
            <TeacherChat />
          </>
        );

      case "Profil":
        return (
          <>
            <DashboardPageTitle page={activeMenu} />
            <Profile />
          </>
        );

      case "Face Recognition":
        return (
          <>
            <DashboardPageTitle page={activeMenu} />
            <FaceRegister />
          </>
        );

      default:
        return null;
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
