"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

type AppError = Error & { statusCode?: number; code?: number };

export default function Error({ error, reset }: { error: AppError; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const code = error.statusCode || error.code || 500;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen select-text">
        <h1 className="text-4xl font-bold mb-4">Error {code}</h1>
        <p className="mb-6">{error.message || "Terjadi kesalahan pada aplikasi."}</p>
        <button onClick={reset} className="text-blue-600 underline">
          Coba Lagi
        </button>
        <Link href="/" className="mt-4 text-gray-600 underline">
          Kembali ke Beranda
        </Link>
      </div>
    </>
  );
}