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
    // Jika tidak ada role, tetap di halaman ini
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    (session?.user?.role && ["ADMIN", "TEACHER", "PARENT"].includes(session.user.role))
  ) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 pt-24">
      {children}
    </div>
  );
}
