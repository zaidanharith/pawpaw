"use client";

import RoleNavbar from "../../../components/layout/RoleNavbar";
import React from "react";
import Link from "next/link";
import { useEffect } from "react";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    useEffect(() => {
    document.body.setAttribute("data-page", "teacher");
    return () => document.body.removeAttribute("data-page");
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <RoleNavbar role="Teacher" />

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start p-8">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-5xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5bb00] w-full flex flex-col text-center py-2 text-sm text-white rounded-t-lg">
        2025 KidConnect. All rights reserved.
      </footer>
    </div>
  );
}
