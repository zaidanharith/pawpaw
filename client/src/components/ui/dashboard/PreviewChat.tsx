import { FiMessageSquare } from "react-icons/fi";

interface RecentMessage {
  id: number;
  title: string;
  date: string;
}

interface RecentMessagesProps {
  onViewAll?: () => void;
}

export default function RecentMessages({ onViewAll }: RecentMessagesProps) {
  const messages: RecentMessage[] = [
    { id: 1, title: "Senam Pagi", date: "12/10 10:30 AM" },
    { id: 2, title: "Senam Pagi", date: "12/10 10:30 AM" },
    { id: 3, title: "Senam Pagi", date: "12/10 10:30 AM" },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Pesan</h3>

      <div className="space-y-3 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-100 transition-colors"
          >
            <FiMessageSquare
              size={24}
              className="text-teal-600 mt-1 shrink-0"
            />

            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">
                {message.title}
              </p>
              <p className="text-xs text-gray-500">{message.date}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Lihat Semuanya
      </button>
    </div>
  );
}