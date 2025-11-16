"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  title: string;
  body: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
}

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
}

export default function ChatList({ onSelectChat }: ChatListProps) {
  const { data: session } = useSession();
  const role = session?.user?.role || "PARENT";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  const chats: Chat[] = [
    {
      id: "1",
      name: "Budi Santoso",
      avatar: "/default-user.png",
      lastMessage: "Halo Ibu/Bapak, saya ijin pendamping di kelas Anak TK A. Ada yang bisa saya bantu hari ini?",
      time: "2 jam lalu",
      title: "Chat",
      body: "Halo Ibu/Bapak, saya ijin pendamping di kelas Anak TK A.",
      isRead: false,
      senderId: "123",
      receiverId: "456",
    },
  ];

  return (
    <>
      <div className="mb-4">
        <h2 className="font-bold text-xl">Daftar Pesan</h2>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Cari Pesan" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-1"/>
      </div>
      <div className="flex flex-col max-h-screen overflow-y-scroll">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className="py-2 first:border-t border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition w-full"
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center relative">
                <Image src={chat.avatar} alt="Foto Profil" width={60} height={60} className="rounded-full object-cover mr-3 border"/>
                <div className="w-4 h-4 rounded-full bg-green-500 absolute bottom-0 right-0 border-2 border-white"></div>
              </div>
              <div className="text-left overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{chat.name}</h3>
                  <p className="text-xs text-gray-500 px-2 py-1 rounded-lg font-bold">{chat.time}</p>
                </div>
                <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}