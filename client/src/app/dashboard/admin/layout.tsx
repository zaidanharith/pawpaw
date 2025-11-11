"use client";

import RoleNavbar from "../../../components/layout/RoleNavbar";
import React from "react";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    useEffect(() => {
    document.body.setAttribute("data-page", "admin");
    return () => document.body.removeAttribute("data-page");
  }, []);

  const [activeMenu, setActiveMenu] = React.useState("Dashboard");
	return (
		<div className="min-h-screen w-full flex flex-col">
      <RoleNavbar
        role="Admin"
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

			{/* Main Content */}
			<main className="flex-1 flex justify-center items-start p-2">
				<div className="p-8 w-full max-w-5xl">
					{children}
				</div>
			</main>

      {/* Footer */}
      <footer className="bg-[#2e6b4b] w-full flex flex-col text-center py-2 text-sm text-white rounded-t-lg">
        2025 KidConnect. All rights reserved.
      </footer>
    </div>
  );
}
