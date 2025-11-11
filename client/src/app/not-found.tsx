import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl text-center font-bold mb-4">404 - Halaman Tidak Ditemukan</h1>
        <p className="mb-6 text-center">Maaf, halaman yang kamu cari tidak tersedia.</p>
        <Link href="/" className="text-blue-600 underline">
          Kembali ke Beranda
        </Link>
      </div>
    </>
  );
}