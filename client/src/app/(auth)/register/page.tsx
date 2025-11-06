"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register User Baru</h1>
        
        <p className="text-gray-600 mb-6 text-center">
          Form registrasi akan ditambahkan di sini
        </p>

        <a
          href="/dashboard"
          className="block w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 text-center"
        >
          Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
}