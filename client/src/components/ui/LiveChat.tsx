"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoIosArrowBack, IoIosSend } from "react-icons/io";
import { FiEdit, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { Chat } from "./ChatList";
import { useEffect, useRef, useState } from "react";

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface LiveChatProps {
  chat: Chat;
  onBack: () => void;
}

export default function LiveChat({ chat, onBack }: LiveChatProps) {
  const { data: session } = useSession();
  const role = session?.user?.role || "PARENT";
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "PARENT" ? "#FFFFFF" : "#282828";
  
  type MessageType = {
    id: string;
    body: string;
    sender: { id: string; name: string; role: string };
    createdAt: string;
    senderId?: string;
    receiverId?: string;
    clientTempId?: string;
  };
  
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = session?.user?.id;
  const otherUser = chat.senderId === currentUserId ? chat.receiver : chat.sender;
  const otherId = chat.senderId === currentUserId ? chat.receiverId : chat.senderId;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Fetch message history
  const fetchMessages = async () => {
    if (!otherId || !session?.accessToken) return;
    
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/messages?otherId=${otherId}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      const data = await res.json();
      
      if (Array.isArray(data.data)) {
        const msgs = data.data as MessageType[];
        const formatted = msgs
          .filter((m) => {
            const s = m.senderId ?? m.sender?.id;
            const r = m.receiverId ?? (m as MessageType & { receiver?: { id?: string } }).receiver?.id;
            return (
              (s === otherId && r === currentUserId) || (s === currentUserId && r === otherId)
            );
          })
          .map((m) => ({ 
            id: m.id, 
            body: m.body, 
            sender: m.sender, 
            createdAt: m.createdAt,
            senderId: m.senderId,
            receiverId: m.receiverId
          }));
        
        formatted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        
        // Check if there are new messages
        if (formatted.length > 0) {
          const latestId = formatted[formatted.length - 1].id;
          if (latestId !== lastMessageIdRef.current) {
            console.log('📩 New messages detected');
            lastMessageIdRef.current = latestId;
          }
        }
        
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [otherId, session?.accessToken, currentUserId]);

  // Start polling every 2 seconds
  useEffect(() => {
    if (!otherId || !session?.accessToken) return;

    console.log('🔄 Starting polling for messages');
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 2000); // Poll every 2 seconds

    return () => {
      if (pollingIntervalRef.current) {
        console.log('⏹️ Stopping polling');
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [otherId, session?.accessToken, currentUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMsg: MessageType = {
      id: tempId,
      clientTempId: tempId,
      body: messageInput.trim(),
      sender: { 
        id: currentUserId || "me", 
        name: session?.user?.name || "Saya", 
        role: session?.user?.role || "PARENT" 
      },
      createdAt: new Date().toISOString(),
      senderId: currentUserId,
      receiverId: otherId,
    };

    // Add temporary message immediately
    setMessages((prev) => {
      const next = [...prev, tempMsg];
      next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return next;
    });

    const messageToSend = messageInput.trim();
    setMessageInput("");

    try {
      const payload = { 
        receiverId: otherId, 
        title: chat.title || "Chat", 
        body: messageToSend 
      };
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (data?.data?.id) {
        // Immediately fetch latest messages to update UI
        await fetchMessages();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove temporary message on error
      setMessages((prev) => prev.filter((m) => m.clientTempId !== tempId));
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  const handleStartEdit = (msg: MessageType) => {
    if (msg.id.startsWith('temp-')) return;
    setEditingId(msg.id);
    setEditingText(msg.body);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (id: string) => {
    const newBody = editingText.trim();
    if (!newBody) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ body: newBody }),
      });
      
      const data = await res.json();
      
      if (data?.data?.id) {
        await fetchMessages();
      }
    } catch (err) {
      console.error('Failed to update message:', err);
      alert("Gagal mengupdate pesan.");
    } finally {
      handleCancelEdit();
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (id.startsWith('temp-')) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      return;
    }
    
    if (!confirm('Hapus pesan ini?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      
      const data = await res.json();
      
      if (data?.success) {
        await fetchMessages();
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert("Gagal menghapus pesan.");
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center border-b pb-3 border-gray-400">
        <button className="text-2xl mr-2 cursor-pointer" onClick={onBack}>
          <IoIosArrowBack />
        </button>
        <div className="flex items-center">
          <Image 
            src={"/default-user.png"} 
            alt="Foto Profil" 
            width={40} 
            height={40} 
            className="rounded-full object-cover mr-3 border" 
          />
        </div>
        <h2 className="font-bold text-xl">{otherUser?.name}</h2>
        <div className="ml-auto">
          <div className="text-xs text-gray-500">🔄 Polling</div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 flex flex-col gap-4 overflow-y-auto p-2">
        {messages.map((m) => {
          const isMine = m.sender?.id === currentUserId;
          const isPending = m.id.startsWith('temp-');
          
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[75%] ${isPending ? 'opacity-60' : ''}`}
                style={{ 
                  background: isMine ? accentColor : "#f3f4f6", 
                  color: isMine ? textColor : "#111827" 
                }}>
                {isMine ? (
                  editingId === m.id ? (
                    <div>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full p-2 rounded-md text-sm text-black"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={handleCancelEdit}
                          aria-label="Batal"
                          className="p-2 rounded bg-gray-200 text-sm cursor-pointer text-black"
                        >
                          <FiX size={16} />
                        </button>
                        <button
                          onClick={() => handleSaveEdit(m.id)}
                          aria-label="Simpan"
                          className="p-2 rounded bg-green-600 text-white text-sm cursor-pointer"
                        >
                          <FiCheck size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm">{m.body}</div>
                      <div className={`text-xs mt-1 ${isMine ? "text-white opacity-80" : "text-gray-400"}`}>
                        {new Date(m.createdAt).toLocaleTimeString("id-ID", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                        {isPending && " (Mengirim...)"}
                      </div>
                      {!isPending && (
                        <div className="flex gap-2 justify-end mt-2">
                          <button 
                            onClick={() => handleStartEdit(m)} 
                            aria-label="Edit pesan" 
                            className="cursor-pointer opacity-70 hover:opacity-100"
                            style={{ background: 'transparent', padding: 0, border: 'none', color: textColor }}
                          >
                            <FiEdit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(m.id)} 
                            aria-label="Hapus pesan" 
                            className="cursor-pointer opacity-70 hover:opacity-100"
                            style={{ background: 'transparent', padding: 0, border: 'none', color: textColor }}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <>
                    <div className="text-sm">{m.body}</div>
                    <div className={`text-xs mt-1 ${isMine ? "text-white" : "text-gray-400"}`}>
                      {new Date(m.createdAt).toLocaleTimeString("id-ID", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tuliskan pesan disini..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-1"
          />

          <button
            onClick={handleSendMessage}
            className="text-white rounded-lg transition-colors shrink-0 p-2 flex items-center justify-center cursor-pointer"
            aria-label="Kirim pesan"
            style={{ background: accentColor, color: textColor }}
            disabled={!messageInput.trim()}
          >
            <IoIosSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}