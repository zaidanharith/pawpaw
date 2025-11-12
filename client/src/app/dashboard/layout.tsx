"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const role = session?.user?.role;
    if (role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (role === "TEACHER") {
      router.push("/dashboard/teacher");
    } else if (role === "PARENT") {
      router.push("/dashboard/parent");
    } else if (role) {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="flex flex-col min-h-screen flex-1 px-4 pt-24 font-sans">
      {children}
    </main>
  );
}
