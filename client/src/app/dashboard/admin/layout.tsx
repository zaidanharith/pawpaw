"use client";

import RoleNavbar from "../../../components/layout/RoleNavbar";
import React, { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");

  useEffect(() => {
    document.body.setAttribute("data-page", "admin");
    return () => document.body.removeAttribute("data-page");
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <RoleNavbar
        role="Admin"
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <main className="flex-1 flex justify-center items-start p-2">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
