"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { DashboardPageTitle, Statistics, Weather, LiveReport, Announcement, Profile, UserTable, StudentTable, ReportPage, AnnouncementPage, ClassPage } from "@/components/ui/dashboard";
import { FaTachometerAlt, FaUser, FaUsers, FaClipboardList, FaBullhorn, FaUserCog, FaRegSmile, } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import FaceRegister from "../ui/dashboard/FaceRegister";

export default function Admin() {

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt size={24} /> },
    { name: "User", icon: <FaUser size={24} /> },
    { name: "Siswa", icon: <FaUsers size={24} /> },
    { name: "Kelas", icon: <SiGoogleclassroom size={24} /> },
    { name: "Laporan Kegiatan", icon: <FaClipboardList size={24} /> },
    { name: "Pengumuman", icon: <FaBullhorn size={24} /> },
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
            <DashboardPageTitle page={activeMenu}/>
            <Weather />
            <Statistics />
            <LiveReport />
            <Announcement />
          </>
        );
      case "User":
        return (
          <>
            <DashboardPageTitle page={activeMenu}/>
            <UserTable onDeleteUser={() => {}} />
          </>
        );
      case "Siswa":
        return (
          <>
            <DashboardPageTitle page={activeMenu}/>
            <StudentTable />
          </>
        );
      case "Kelas":
        return (
          <>
            <DashboardPageTitle page={activeMenu}/>
            <ClassPage />
          </>
        );
      case "Laporan Kegiatan":
        return (
          <>
            <DashboardPageTitle page={activeMenu}/>
            <ReportPage />
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
            <Profile />
          </>
        );
      case "Face Recognition":
        return (
          <>
            <DashboardPageTitle page={activeMenu}/>
            <FaceRegister />
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
