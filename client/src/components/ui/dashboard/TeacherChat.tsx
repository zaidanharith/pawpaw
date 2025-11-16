<<<<<<< Updated upstream
"use client";

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  sender: "teacher" | "parent";
=======
  sender: "parent" | "teacher";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      text: "Selamat pagi Bu. Ada yang bisa saya bantu hari ini? ",
      sender: "teacher",
      time: "08:00",
    },
    {
      id: 2,
      text: "Pagi Bu. Anak saya izin tidak masuk ya.",
      sender: "parent",
      time: "08:02",
=======
      text: "Halo Ibu/Bapak, saya ijin pindamping di kelas Anak Tk A. Ada yang bisa saya bantu hari ini? 😊",
      sender: "teacher",
      time: "08:30",
    },
    {
      id: 2,
      text: "Halo Bu, saya ingin menanyakan surat izin untuk anak saya.",
      sender: "parent",
      time: "08:32",
    },
    {
      id: 3,
      text: "Baik Ibu/Bapak. Bisa dijelaskan lebih lanjut? ya, izin untuk keperluan apa?",
      sender: "teacher",
      time: "08:33",
    },
    {
      id: 4,
      text: "Anak saya, Dira, sedang kurang sehat hari ini dan tidak bisa masuk sekolah",
      sender: "parent",
      time: "08:35",
    },
    {
      id: 5,
      text: "Oh begitu. Semoga lekas sembuh ya untuk Dira. Boleh saya minta detail keterangannya?",
      sender: "teacher",
      time: "08:36",
>>>>>>> Stashed changes
    },
  ]);

  const parents: Parent[] = [
    {
      id: 1,
<<<<<<< Updated upstream
      name: "Salsabila Khairunissa",
      badge: "Baru",
      message: "Pagi Bu, anak saya izin tidak masuk ya",
      time: "08:01",
=======
      name: "Amira S Pohan",
      badge: "Baru",
      message: "Halo Bu, saya ingin menanyakan surat izin untuk anak saya.",
      time: "08:30",
>>>>>>> Stashed changes
      isRead: false,
    },
    {
      id: 2,
<<<<<<< Updated upstream
      name: "Irfan Kurniawan",
      message: "Bu, apakah besok ada tugas yang perlu dibawa?",
      time: "10:20",
=======
      name: "Budi Santoso",
      message: "Terima kasih Bu atas laporannya hari ini",
      time: "12:00",
>>>>>>> Stashed changes
      isRead: true,
    },
    {
      id: 3,
<<<<<<< Updated upstream
      name: "Rika Sugiarto",
      badge: "Baru",
      message: "Selamat pagi Bu, izin bertanya soal kegiatan outing class",
      time: "07:45",
=======
      name: "Siti Nurhaliza",
      badge: "Baru",
      message: "Bu, apakah besok ada kegiatan outdoor?",
      time: "08:30",
>>>>>>> Stashed changes
      isRead: false,
    },
  ];

<<<<<<< Updated upstream
  const filteredParents = parents.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "semua" || (activeTab === "belum" && !p.isRead);
=======
  const filteredParents = parents.filter(parent => {
    const matchesSearch = parent.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "semua" || (activeTab === "belum" && !parent.isRead);
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // Jika parent dipilih
  if (selectedParent) {
    return (
      <div className="flex flex-col h-screen bg-yellow-50 rounded-lg shadow-sm">
        {/* Header */}
        <div className="bg-yellow-500 text-white px-4 py-4 flex items-center gap-3 shadow-md rounded-t-lg">
=======
  // If parent is selected, show chat detail
  if (selectedParent) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-yellow-500 text-white px-4 py-4 flex items-center gap-3 shadow-md">
>>>>>>> Stashed changes
          <button
            onClick={() => setSelectedParent(null)}
            className="hover:bg-yellow-600 p-2 rounded-lg transition-colors"
          >
            <FaChevronLeft size={20} />
          </button>
<<<<<<< Updated upstream
          <h2 className="font-bold text-lg">{selectedParent}</h2>
        </div>

        {/* Chat messages */}
=======
          <h2 className="font-bold text-lg">Parent & Teacher</h2>
        </div>

        {/* Messages Container */}
>>>>>>> Stashed changes
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "teacher" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.sender === "teacher"
<<<<<<< Updated upstream
                    ? "bg-yellow-300 text-gray-900"
                    : "bg-white border border-yellow-300 text-gray-900"
=======
                    ? "bg-teal-100 text-gray-900"
                    : "bg-yellow-100 text-gray-900"
>>>>>>> Stashed changes
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

<<<<<<< Updated upstream
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
=======
        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Tuliskan pesan disini..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-3 bg-yellow-500 text-white placeholder-yellow-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <button
              onClick={handleSendMessage}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg transition-colors shrink-0"
            >
              <FaPaperPlane size={20} />
>>>>>>> Stashed changes
            </button>
          </div>
        </div>
      </div>
    );
  }

<<<<<<< Updated upstream
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
=======
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari Pesan"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
>>>>>>> Stashed changes

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("semua")}
<<<<<<< Updated upstream
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "semua"
              ? "bg-yellow-200"
              : "bg-white border border-gray-300"
=======
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "semua"
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-600 border border-gray-300"
>>>>>>> Stashed changes
          }`}
        >
          Semua
        </button>
<<<<<<< Updated upstream

        <button
          onClick={() => setActiveTab("belum")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "belum"
              ? "bg-yellow-500 text-white"
              : "bg-white border border-gray-300"
=======
        <button
          onClick={() => setActiveTab("belum")}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "belum"
              ? "bg-yellow-500 text-white"
              : "bg-white text-gray-600 border border-gray-300"
>>>>>>> Stashed changes
          }`}
        >
          Belum dibaca
        </button>
      </div>

<<<<<<< Updated upstream
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
=======
      {/* Parent List */}
      <div className="space-y-4">
        {filteredParents.map((parent) => (
          <div
            key={parent.id}
            onClick={() => setSelectedParent(parent.name)}
            className="border border-yellow-500 rounded-lg p-4 hover:bg-yellow-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center shrink-0">
                <FaUser className="text-white text-xl" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{parent.name}</h3>
                  {parent.badge && (
                    <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {parent.badge}
                    </span>
                  )}
                  <span className="ml-auto text-sm text-gray-500">{parent.time}</span>
                </div>
                <p className="text-gray-700 mb-3">{parent.message}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedParent(parent.name);
                  }}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
>>>>>>> Stashed changes
                >
                  Balas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredParents.length === 0 && (
<<<<<<< Updated upstream
        <p className="text-center text-gray-500 mt-6">Tidak ada pesan ditemukan</p>
=======
        <div className="text-center py-12 text-gray-500">
          Tidak ada pesan yang ditemukan
        </div>
>>>>>>> Stashed changes
      )}
    </div>
  );
}