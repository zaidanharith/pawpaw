"use client";

import { useSession } from "next-auth/react";
import RoleLabel from "../../components/ui/dashboard/RoleLabel";
import { Admin, Parent, Teacher } from "../../components/dashboard";

export default function DashboardPage() {
    const { data: session } = useSession();
    const role = session?.user?.role;

    return (
        <div className="px-4 md:px-0 flex flex-col items-center">
            <main className="w-full md:px-4">
                <header className="flex items-center justify-start gap-2 mt-2">
                    <h1 className="font-bold text-foreground text-2xl min-w-5">
                        Halo, {session?.user?.name || "User"}
                    </h1>
                    <RoleLabel role={role || "Guest"} />
                </header>
                <section>
                    {role === "ADMIN" && <Admin />}
                    {role === "TEACHER" && <Teacher />}
                    {role === "PARENT" && <Parent />}
                </section>
            </main>
        </div>
    );
}