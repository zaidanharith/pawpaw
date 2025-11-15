import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
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
    <html lang="id" className="scroll-smooth select-none">
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col select-none">
            <main className="pt-24 font-sans flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
