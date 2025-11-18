"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoIosArrowBack, IoIosSend } from "react-icons/io";
import { FiEdit, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { Chat } from "./ChatList";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface LiveChatProps {
  chat: Chat;
  onBack: () => void;
}

type MessageType = {
  id: string;
  body: string;
  sender: { id: string; name: string; role: string };
  createdAt: string;
  senderId?: string;
  receiverId?: string;
  clientTempId?: string;
};

export default function LiveChat({ chat, onBack }: LiveChatProps) {
  const { data: session } = useSession();
  const role = session?.user?.role || "PARENT";
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "PARENT" ? "#FFFFFF" : "#282828";
  
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = session?.user?.id;
  const otherUser = chat.senderId === currentUserId ? chat.receiver : chat.sender;
  const otherId = chat.senderId === currentUserId ? chat.receiverId : chat.senderId;
  const socketRef = useRef<Socket | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // Gunakan useCallback untuk fungsi yang stabil
  const isRelatedToCurrent = useCallback((msg: MessageType) => {
    const s = msg.senderId ?? msg.sender?.id;
    const r = msg.receiverId ?? (msg as MessageType & { receiver?: { id?: string } }).receiver?.id;
    return ((s === otherId && r === currentUserId) || (s === currentUserId && r === otherId));
  }, [otherId, currentUserId]);

  // Fetch history messages
  useEffect(() => {
    const fetchHistory = async () => {
      setMessages([]);
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
            .map((m) => ({ id: m.id, body: m.body, sender: m.sender, createdAt: m.createdAt }));
          formatted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          setMessages(formatted);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    };

    if (otherId && session?.accessToken) fetchHistory();
  }, [otherId, session?.accessToken, currentUserId]);

  // Socket connection - PERBAIKAN UTAMA
  useEffect(() => {
    if (!session?.accessToken || !currentUserId || !otherId) return;

    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
    const socket = io(base, {
      auth: { token: session?.accessToken },
      transports: ['websocket', 'polling'], // Tambahkan ini untuk koneksi yang lebih stabil
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join', { otherId, userId: currentUserId });
    });

    socket.on('connect_error', (err: unknown) => {
      console.error('Socket connect error', err);
    });

    // Handler untuk pesan masuk - gunakan functional update untuk menghindari stale closure
    const handleIncoming = (msg: MessageType) => {
      if (!msg || !msg.id) return;
      
      const s = msg.senderId ?? msg.sender?.id;
      const r = msg.receiverId ?? (msg as MessageType & { receiver?: { id?: string } }).receiver?.id;
      const isRelated = ((s === otherId && r === currentUserId) || (s === currentUserId && r === otherId));
      
      if (!isRelated) {
        return;
      }

      setMessages((prev) => {
        // Cek apakah pesan sudah ada
        if (prev.find((m) => m.id === msg.id)) return prev;

        const incomingTime = new Date(msg.createdAt).getTime();
        const TEN_SEC = 10000;
        
        // Cari dan replace temporary message
        const tempIndex = prev.findIndex((m) => 
          m.clientTempId && 
          m.sender?.id === currentUserId && 
          m.body === msg.body && 
          Math.abs(new Date(m.createdAt).getTime() - incomingTime) <= TEN_SEC
        );
        
        if (tempIndex !== -1) {
          const next = [...prev];
          next[tempIndex] = { 
            id: msg.id, 
            body: msg.body, 
            sender: msg.sender, 
            createdAt: msg.createdAt, 
            senderId: msg.senderId, 
            receiverId: msg.receiverId 
          };
          next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          return next;
        }

        // Tambah pesan baru
        const next = [...prev, { 
          id: msg.id, 
          body: msg.body, 
          sender: msg.sender, 
          createdAt: msg.createdAt, 
          senderId: msg.senderId, 
          receiverId: msg.receiverId 
        }];
        next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return next;
      });
    };

    const handleUpdated = (msg: MessageType) => {
      if (!msg || !msg.id) return;
      
      const s = msg.senderId ?? msg.sender?.id;
      const r = msg.receiverId ?? (msg as MessageType & { receiver?: { id?: string } }).receiver?.id;
      const isRelated = ((s === otherId && r === currentUserId) || (s === currentUserId && r === otherId));
      
      if (!isRelated) return;
      
      setMessages((prev) => prev.map((m) => 
        (m.id === msg.id ? { ...m, body: msg.body, createdAt: msg.createdAt } : m)
      ));
    };

    const handleDeleted = (payload: { id: string; senderId?: string; receiverId?: string }) => {
      if (!payload || !payload.id) return;
      setMessages((prev) => prev.filter((m) => m.id !== payload.id));
    };

    // Register event listeners
    socket.on('message:received', handleIncoming);
    socket.on('message:sent', handleIncoming);
    socket.on('message:updated', handleUpdated);
    socket.on('message:deleted', handleDeleted);

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up socket');
      socket.off('message:received');
      socket.off('message:sent');
      socket.off('message:updated');
      socket.off('message:deleted');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session?.accessToken, currentUserId, otherId]); // otherId tetap di sini karena perlu reconnect saat ganti chat

  // Auto scroll to bottom
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

    setMessages((s) => {
      const next = [...s, tempMsg];
      next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return next;
    });

    const currentMessage = messageInput.trim();
    setMessageInput(""); // Clear input immediately

    try {
      const payload = { 
        receiverId: otherId, 
        title: chat.title || "Chat", 
        body: currentMessage 
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
        const srv = data.data as MessageType;
        setMessages((prev) => {
          const tempIndex = prev.findIndex((m) => m.clientTempId === tempId);
          if (tempIndex !== -1) {
            const next = [...prev];
            next[tempIndex] = { 
              id: srv.id, 
              body: srv.body, 
              sender: srv.sender, 
              createdAt: srv.createdAt, 
              senderId: srv.senderId, 
              receiverId: srv.receiverId 
            };
            next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            return next;
          }

          if (prev.find((m) => m.id === srv.id)) return prev;
          
          const next = [...prev, { 
            id: srv.id, 
            body: srv.body, 
            sender: srv.sender, 
            createdAt: srv.createdAt, 
            senderId: srv.senderId, 
            receiverId: srv.receiverId 
          }];
          next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to send message", err);
      // Rollback temporary message jika gagal
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setMessageInput(currentMessage); // Restore message
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
        const updated = data.data as MessageType;
        setMessages((prev) => prev.map((m) => 
          (m.id === updated.id ? { ...m, body: updated.body, createdAt: updated.createdAt } : m)
        ));
      }
    } catch (err) {
      console.error('Failed to update message', err);
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
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete message', err);
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
      </div>

      <div ref={containerRef} className="flex-1 flex flex-col gap-4 overflow-y-auto p-2">
        {messages.map((m) => {
          const isMine = m.sender?.id === currentUserId;
          const isPending = m.id.startsWith('temp-');
          
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[75%] ${isPending ? 'opacity-60' : ''} ${isMine ? "text-right relative" : "text-left"}`}
                style={{ 
                  background: isMine ? accentColor : "#f3f4f6", 
                  color: isMine ? textColor : "#111827" 
                }}
              >
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
                      <div className={`text-xs mt-1 ${isMine ? "text-white" : "text-gray-400"}`}>
                        {new Date(m.createdAt).toLocaleTimeString("id-ID", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                        {isPending && " (mengirim...)"}
                      </div>
                      {!isPending && (
                        <div className="flex gap-2 justify-end mt-2">
                          <button 
                            onClick={() => handleStartEdit(m)} 
                            aria-label="Edit pesan" 
                            className="p-0 ml-2 cursor-pointer" 
                            style={{ 
                              background: 'transparent', 
                              padding: 0, 
                              border: 'none', 
                              color: textColor 
                            }}
                          >
                            <FiEdit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(m.id)} 
                            aria-label="Hapus pesan" 
                            className="p-0 ml-2 cursor-pointer" 
                            style={{ 
                              background: 'transparent', 
                              padding: 0, 
                              border: 'none', 
                              color: textColor 
                            }}
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