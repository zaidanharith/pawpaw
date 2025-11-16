import { useState } from "react";
import { FaChevronLeft, FaPaperPlane } from "react-icons/fa";

interface Message {
  id: number;
  text: string;
  sender: "parent" | "teacher";
  time: string;
}

interface ChatDetailProps {
  teacherName: string;
  onBack: () => void;
}

export default function ChatDetail({ teacherName, onBack }: ChatDetailProps) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
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

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        sender: "teacher",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal-500 text-white px-4 py-4 flex items-center gap-3 shadow-md">
        <button
          onClick={onBack}
          className="hover:bg-teal-600 p-2 rounded-lg transition-colors"
        >
          <FaChevronLeft size={20} />
        </button>
        <h2 className="font-bold text-lg">Parent & Teacher</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
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