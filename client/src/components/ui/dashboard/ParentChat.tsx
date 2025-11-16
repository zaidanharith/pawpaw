import { useState } from "react";
import { FaUser, FaChevronLeft, FaPaperPlane } from "react-icons/fa";

interface Teacher {
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
  sender: "parent" | "teacher";
  time: string;
}

export default function ParentChat() {
  const [activeTab, setActiveTab] = useState<"semua" | "belum">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Halo Ibu/Bapak, saya ijin pindamping di kelas Anak Tk A. Ada yang bisa saya bantu hari ini? 😊",
      sender: "parent",
      time: "08:30",
    },
    {
      id: 2,
      text: "Halo Bu, saya ingin menanyakan surat izin untuk anak saya.",
      sender: "teacher",
      time: "08:32",
    },
    {
      id: 3,
      text: "Baik Ibu/Bapak. Bisa dijelaskan lebih lanjut? ya, izin untuk keperluan apa?",
      sender: "parent",
      time: "08:33",
    },
    {
      id: 4,
      text: "Anak saya, Dira, sedang kurang sehat hari ini dan tidak bisa masuk sekolah",
      sender: "teacher",
      time: "08:35",
    },
    {
      id: 5,
      text: "Oh begitu. Semoga lekas sembuh ya untuk Dira. Boleh saya minta detail keterangannya?",
      sender: "parent",
      time: "08:36",
    },
  ]);

  const teachers: Teacher[] = [
    {
      id: 1,
      name: "Hendy Wicaksono",
      badge: "Baru",
      message: "Baik Ibu/Bapak. Bisa dijelaskan lebih lanjut ya, izin untuk keperluan apa?",
      time: "08:30",
      isRead: false,
    },
    {
      id: 2,
      name: "Sarah Qonita",
      message: "Selamat siang Ibu, Apakah anak-anak sudah selesai kegiatan pembelajarannya?",
      time: "12:00",
      isRead: true,
    },
    {
      id: 3,
      name: "Rani Khairunisa",
      badge: "Baru",
      message: "Selamat malam Ibu, apakah untuk Kelas B1 mulai minggu depan sudah mulai ganti topik pembelajaran?",
      time: "08:30",
      isRead: false,
    },
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "semua" || (activeTab === "belum" && !teacher.isRead);
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

  // If teacher is selected, show chat detail
  if (selectedTeacher) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-teal-500 text-white px-4 py-4 flex items-center gap-3 shadow-md">
          <button
            onClick={() => setSelectedTeacher(null)}
            className="hover:bg-teal-600 p-2 rounded-lg transition-colors"
          >
            <FaChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-lg">Parent & Teacher</h2>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "teacher" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.sender === "teacher"
                    ? "bg-teal-100 text-gray-900"
                    : "bg-yellow-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Tuliskan pesan disini..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-3 bg-teal-500 text-white placeholder-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <button
              onClick={handleSendMessage}
              className="bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-lg transition-colors shrink-0"
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari Pesan"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("semua")}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "semua"
              ? "bg-gray-200 text-gray-900"
              : "bg-white text-gray-600 border border-gray-300"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setActiveTab("belum")}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "belum"
              ? "bg-teal-500 text-white"
              : "bg-white text-gray-600 border border-gray-300"
          }`}
        >
          Belum dibaca
        </button>
      </div>

      {/* Teacher List */}
      <div className="space-y-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            onClick={() => setSelectedTeacher(teacher.name)}
            className="border border-teal-500 rounded-lg p-4 hover:bg-teal-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center shrink-0">
                <FaUser className="text-white text-xl" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{teacher.name}</h3>
                  {teacher.badge && (
                    <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {teacher.badge}
                    </span>
                  )}
                  <span className="ml-auto text-sm text-gray-500">{teacher.time}</span>
                </div>
                <p className="text-gray-700 mb-3">{teacher.message}</p>
                <button 
                  onClick={() => setSelectedTeacher(teacher.name)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Balas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Tidak ada pesan yang ditemukan
        </div>
      )}
    </div>
  );
}