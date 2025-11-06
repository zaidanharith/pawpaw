"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h2 className="text-xl">Selamat datang, {session?.user.name}</h2>
    </div>
  );
} 