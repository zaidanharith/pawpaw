"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { Chat } from "./ChatList";

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface LiveChatProps {
  chat: Chat;
  onBack: () => void;
}

export default function LiveChat({ chat, onBack }: LiveChatProps) {
  const { data: session } = useSession();
  const role = session?.user?.role || "PARENT";
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "PARENT" ? "#FFFFFF" : "#282828";

  return (
    <>
      <div className="mb-5 flex items-center border-b pb-3 border-gray-400">
        <button className="text-2xl mr-2 cursor-pointer" onClick={onBack}>
          <IoIosArrowBack />
        </button>
        <div className="flex items-center">
          <Image src="/default-user.png" alt="Foto Profil" width={40} height={40} className="rounded-full object-cover mr-3 border"/>
        </div>
        <h2 className="font-bold text-xl">Budi Santoso</h2>
      </div>
      <div className="flex flex-col gap-4 overflow-y-scroll">

        {/* Bubble chat dari user lain */}
        <div className="flex items-start">
          <Image src="/default-user.png" alt="User" width={32} height={32} className="rounded-full object-cover mr-2 border" />
          <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
            <span className="text-sm">Halo Ibu/Bapak, saya ijin pendamping di kelas Anak TK A. Ada yang bisa saya bantu hari ini?</span>
          </div>
        </div>

        {/* Bubble chat dari user sendiri */}
        <div className="flex items-end justify-end">
          <div style={{ background: accentColor, color: textColor }} className="rounded-lg px-4 py-2 max-w-xs">
            <span className="text-sm">Saya ingin bertanya tentang jadwal pelajaran.</span>
          </div>
          <Image src="/default-user.png" alt="Me" width={32} height={32} className="rounded-full object-cover ml-2 border" />
        </div>
      </div>
    </>
  );
}