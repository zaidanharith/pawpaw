import { FiMessageSquare } from "react-icons/fi";

interface RecentMessage {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface RecentMessagesProps {
  onViewAll?: () => void;
}

export default function RecentMessages({ onViewAll }: RecentMessagesProps) {
  const messages: RecentMessage[] = [
    { 
      id: 1, 
      title: "Senam Pagi", 
      description: "Yth. Bapak/Ibu, Minggu ini, Kelas A1 akan fokus pada...",
      date: "16 Nov" 
    },
    { 
      id: 2, 
      title: "Jadwal Ekstrakurikuler", 
      description: "Perubahan jadwal ekstrakurikuler untuk minggu depan...",
      date: "15 Nov" 
    },
    { 
      id: 3, 
      title: "Reminder Pembayaran", 
      description: "Pengingat pembayaran SPP bulan November...",
      date: "15 Nov" 
    },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="font-bold text-xl text-gray-900 mb-4">Pesan</h2>

      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-white border border-teal-200 rounded-lg p-4 flex items-start gap-4 hover:border-teal-300 transition-colors cursor-pointer"
          >
            <div className="bg-teal-100 rounded-lg p-3 shrink-0">
              <FiMessageSquare size={24} className="text-teal-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base mb-1">
                {message.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {message.description}
              </p>
            </div>

            <div className="text-sm text-gray-500 shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              {message.date}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
      >
        Lihat Semuanya
      </button>
    </div>
  );
}