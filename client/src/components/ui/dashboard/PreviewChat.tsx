"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ChatList, { Chat } from "../ChatList";
import LiveChat from "../LiveChat";

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

export default function PreviewChat() {
  const { data: session } = useSession();
  const role = session?.user?.role || "PARENT";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <section className="bg-white rounded-xl shadow p-5">
      {!selectedChat ? (
        <ChatList onSelectChat={setSelectedChat} />
      ) : (
        <LiveChat chat={selectedChat} onBack={() => setSelectedChat(null)} />
      )}
    </section>
  );
}