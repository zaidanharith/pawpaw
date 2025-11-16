"use client";

import { useSession } from "next-auth/react";
import RoleLabel from "../../../components/ui/dashboard/RoleLabel";
import { Admin, Parent, Teacher } from "../../../components/dashboard";
import React from "react";

export default function SubDashboardPage(props: { params: Promise<{ page: string }> }) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const params = React.use(props.params);
  const page = params.page ?? "";

  return (
    <div className="px-4 flex flex-col items-center">
      <main className="w-full">
        <header className="flex items-center justify-start gap-2 mt-2">
          <h1 className="font-bold text-foreground text-2xl min-w-5">
            Halo, {(session?.user?.name) || "User"}
          </h1>
          <RoleLabel role={role || "Guest"} />
        </header>
        <section>
          {role === "ADMIN" && <Admin activePage={page} />}
          {role === "TEACHER" && <Teacher activePage={page} />}
          {role === "PARENT" && <Parent activePage={page} />}
        </section>
      </main>
    </div>
  );
}