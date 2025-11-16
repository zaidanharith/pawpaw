"use client";

import { useState } from "react";
import { FaUser, FaChevronLeft, FaPaperPlane } from "react-icons/fa";

interface Parent {
  id: number;
  name: string;
  badge?: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: "teacher" | "parent";
  time: string;
}

export default function TeacherChat() {
  const [activeTab, setActiveTab] = useState<"semua" | "belum">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Selamat pagi Bu. Ada yang bisa saya bantu hari ini? ",
      sender: "teacher",
      time: "08:00",
    },
    {
      id: 2,
      text: "Pagi Bu. Anak saya izin tidak masuk ya.",
      sender: "parent",
      time: "08:02",
    },
  ]);

  const parents: Parent[] = [
    {
      id: 1,
      name: "Salsabila Khairunissa",
      badge: "Baru",
      message: "Pagi Bu, anak saya izin tidak masuk ya",
      time: "08:01",
      isRead: false,
    },
    {
      id: 2,
      name: "Irfan Kurniawan",
      message: "Bu, apakah besok ada tugas yang perlu dibawa?",
      time: "10:20",
      isRead: true,
    },
    {
      id: 3,
      name: "Rika Sugiarto",
      badge: "Baru",
      message: "Selamat pagi Bu, izin bertanya soal kegiatan outing class",
      time: "07:45",
      isRead: false,
    },
  ];

  const filteredParents = parents.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "semua" || (activeTab === "belum" && !p.isRead);
    return matchesSearch && matchesTab;
  });

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: chatMessages.length + 1,
        text: messageInput,
        sender: "teacher",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput("");
    }
  };

  // Jika parent dipilih
  if (selectedParent) {
    return (
      <div className="flex flex-col h-screen bg-yellow-50 rounded-lg shadow-sm">
        {/* Header */}
        <div className="bg-yellow-500 text-white px-4 py-4 flex items-center gap-3 shadow-md rounded-t-lg">
          <button
            onClick={() => setSelectedParent(null)}
            className="hover:bg-yellow-600 p-2 rounded-lg transition-colors"
          >
            <FaChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-lg">{selectedParent}</h2>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "teacher" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.sender === "teacher"
                    ? "bg-yellow-300 text-gray-900"
                    : "bg-white border border-yellow-300 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Ketik pesan..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-3 bg-yellow-300 text-gray-900 rounded-lg placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg transition-colors"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List parent
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Search */}
      <input
        type="text"
        placeholder="Cari orang tua murid..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 border mb-6 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("semua")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "semua"
              ? "bg-yellow-200"
              : "bg-white border border-gray-300"
          }`}
        >
          Semua
        </button>

        <button
          onClick={() => setActiveTab("belum")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "belum"
              ? "bg-yellow-500 text-white"
              : "bg-white border border-gray-300"
          }`}
        >
          Belum dibaca
        </button>
      </div>

      {/* Parent list */}
      <div className="space-y-4">
        {filteredParents.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedParent(p.name)}
            className="border border-yellow-500 rounded-lg p-4 hover:bg-yellow-50 cursor-pointer transition"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{p.name}</h3>
                  {p.badge && (
                    <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  <span className="ml-auto text-sm text-gray-500">{p.time}</span>
                </div>

                <p className="text-gray-700 mt-1">{p.message}</p>

                <button
                  onClick={() => setSelectedParent(p.name)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white mt-3 py-2 rounded-lg"
                >
                  Balas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredParents.length === 0 && (
        <p className="text-center text-gray-500 mt-6">Tidak ada pesan ditemukan</p>
      )}
    </div>
  );
}