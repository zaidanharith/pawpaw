"use client";

import { useState } from "react";
import ChatList, { Chat } from "../ChatList";
import LiveChat from "../LiveChat";

interface PreviewChatProps {
  selectedChat?: Chat | null;
  onSelectChat?: (chat: Chat | null) => void;
}

export default function PreviewChat({ selectedChat: selectedChatProp = undefined, onSelectChat }: PreviewChatProps) {

  const [internalSelectedChat, setInternalSelectedChat] = useState<Chat | null>(null);
  const selectedChat = selectedChatProp !== undefined ? selectedChatProp : internalSelectedChat;

  const handleSelectChat = (chat: Chat) => {
    if (onSelectChat) onSelectChat(chat);
    else setInternalSelectedChat(chat);
  };

  const handleBack = () => {
    if (onSelectChat) onSelectChat(null);
    else setInternalSelectedChat(null);
  };

  return (
    <section className="bg-white rounded-xl shadow p-5">
      {!selectedChat ? (
        <ChatList onSelectChat={handleSelectChat} />
      ) : (
        <LiveChat chat={selectedChat} onBack={handleBack} />
      )}
    </section>
  );
}