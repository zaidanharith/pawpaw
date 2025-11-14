"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";

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
  }, [status, session, router]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="font-sans">
      {children}
    </main>
  );
}
