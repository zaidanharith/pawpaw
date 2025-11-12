import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KidConnect",
  description: "Sistem manajemen sekolah TK untuk monitoring dan pelaporan kegiatan siswa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider>
          <main className="min-h-screen font-sans">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
