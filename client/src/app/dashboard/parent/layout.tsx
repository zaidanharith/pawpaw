"use client";

import RoleNavbar from "../../../components/layout/RoleNavbar";
import React, { useEffect, useState } from "react";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeMenu, setActiveMenu] = useState<string>("");

  useEffect(() => {
    document.body.setAttribute("data-page", "parent");
    return () => document.body.removeAttribute("data-page");
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <RoleNavbar
        role="Parent"
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start p-8">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-5xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#58baab] w-full flex flex-col text-center py-2 text-sm text-white rounded-t-lg">
        2025 KidConnect. All rights reserved.
      </footer>
    </div>
  );
}
