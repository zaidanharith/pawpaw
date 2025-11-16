"use client";

import { useState } from "react";
import { FaUser, FaChevronLeft, FaPaperPlane } from "react-icons/fa";

interface Contact {
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
  sender: "user" | "contact";
  time: string;
}

interface UnifiedChatProps {
  role: "teacher" | "parent";
}

export default function UnifiedChat({ role }: UnifiedChatProps) {
  const [activeTab, setActiveTab] = useState<"semua" | "belum">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Halo Ibu/Bapak, saya ijin pendamping di kelas Anak TK A. Ada yang bisa saya bantu hari ini? 😊",
      sender: role === "teacher" ? "user" : "contact",
      time: "08:30",
    },
    {
      id: 2,
      text: "Halo Bu, saya ingin menanyakan surat izin untuk anak saya.",
      sender: role === "teacher" ? "contact" : "user",
      time: "08:32",
    },
    {
      id: 3,
      text: "Baik Ibu/Bapak. Bisa dijelaskan lebih lanjut? ya, izin untuk keperluan apa?",
      sender: role === "teacher" ? "user" : "contact",
      time: "08:33",
    },
    {
      id: 4,
      text: "Anak saya, Dira, sedang kurang sehat hari ini dan tidak bisa masuk sekolah",
      sender: role === "teacher" ? "contact" : "user",
      time: "08:35",
    },
    {
      id: 5,
      text: "Oh begitu. Semoga lekas sembuh ya untuk Dira. Boleh saya minta detail keterangannya?",
      sender: role === "teacher" ? "user" : "contact",
      time: "08:36",
    },
  ]);

  // Color classes based on role (using complete Tailwind classes)
  const colorClasses = role === "teacher" 
    ? {
        header: "bg-yellow-500",
        headerHover: "hover:bg-yellow-600",
        userBubble: "bg-teal-100",
        contactBubble: "bg-yellow-100",
        input: "bg-yellow-500 placeholder-yellow-100 focus:ring-yellow-600",
        button: "bg-yellow-500 hover:bg-yellow-600",
        border: "border-yellow-500",
        hover: "hover:bg-yellow-50",
        badge: "bg-yellow-500",
        tabActive: "bg-yellow-500",
        focusRing: "focus:ring-yellow-500",
      }
    : {
        header: "bg-teal-500",
        headerHover: "hover:bg-teal-600",
        userBubble: "bg-teal-100",
        contactBubble: "bg-yellow-100",
        input: "bg-teal-500 placeholder-teal-100 focus:ring-teal-600",
        button: "bg-teal-500 hover:bg-teal-600",
        border: "border-teal-500",
        hover: "hover:bg-teal-50",
        badge: "bg-teal-500",
        tabActive: "bg-teal-500",
        focusRing: "focus:ring-teal-500",
      };

  // Contact list based on role
  const contacts: Contact[] = role === "teacher" 
    ? [
        {
          id: 1,
          name: "Amira S Pohan",
          badge: "Baru",
          message: "Halo Bu, saya ingin menanyakan surat izin untuk anak saya.",
          time: "08:30",
          isRead: false,
        },
        {
          id: 2,
          name: "Budi Santoso",
          message: "Terima kasih Bu atas laporannya hari ini",
          time: "12:00",
          isRead: true,
        },
        {
          id: 3,
          name: "Siti Nurhaliza",
          badge: "Baru",
          message: "Bu, apakah besok ada kegiatan outdoor?",
          time: "08:30",
          isRead: false,
        },
      ]
    : [
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

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "semua" || (activeTab === "belum" && !contact.isRead);
    return matchesSearch && matchesTab;
  });

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: chatMessages.length + 1,
        text: messageInput,
        sender: "user",
        time: new Date().toLocaleTimeString("id-ID", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput("");
    }
  };

  // If contact is selected, show chat detail
  if (selectedContact) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className={`${colorClasses.header} text-white px-4 py-4 flex items-center gap-3 shadow-md`}>
          <button
            onClick={() => setSelectedContact(null)}
            className={`${colorClasses.headerHover} p-2 rounded-lg transition-colors`}
          >
            <FaChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-lg">{selectedContact}</h2>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? `${colorClasses.userBubble} text-gray-900`
                    : `${colorClasses.contactBubble} text-gray-900`
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
              className={`flex-1 px-4 py-3 ${colorClasses.input} text-white rounded-lg focus:outline-none focus:ring-2`}
            />
            <button
              onClick={handleSendMessage}
              className={`${colorClasses.button} text-white p-3 rounded-lg transition-colors shrink-0`}
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Contact list view
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari Pesan"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colorClasses.focusRing}`}
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
              ? `${colorClasses.tabActive} text-white`
              : "bg-white text-gray-600 border border-gray-300"
          }`}
        >
          Belum dibaca
        </button>
      </div>

      {/* Contact List */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedContact(contact.name)}
            className={`border ${colorClasses.border} rounded-lg p-4 ${colorClasses.hover} transition-colors cursor-pointer`}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center shrink-0">
                <FaUser className="text-white text-xl" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{contact.name}</h3>
                  {contact.badge && (
                    <span className={`${colorClasses.badge} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {contact.badge}
                    </span>
                  )}
                  <span className="ml-auto text-sm text-gray-500">{contact.time}</span>
                </div>
                <p className="text-gray-700 mb-3">{contact.message}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedContact(contact.name);
                  }}
                  className={`w-full ${colorClasses.button} text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
                >
                  Balas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Tidak ada pesan yang ditemukan
        </div>
      )}
    </div>
  );
}