"use client";

import { useSession } from "next-auth/react";
import RoleLabel from "../../components/ui/RoleLabel";
import Admin from "../../components/dashboard/admin/Admin";

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
  };

  return (
    <div className="px-4">
      <header className="flex items-center justify-start gap-2">
        <h1 className="font-bold text-foreground text-2xl min-w-5">Halo, {(session?.user?.name) || "Joecelyn Aurora Majesty"}</h1>
        <RoleLabel role={role || "Guest"} />
      </header>

      <section>
        <Admin />
      </section>
    </div>
  );
} 