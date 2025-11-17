"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { RiChatNewFill } from "react-icons/ri";
import { FiX } from "react-icons/fi";

export interface Chat {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
  receiver: { id: string; name: string; role: string };
  messageCount?: number;
}

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
}

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

export default function ChatList({ onSelectChat }: ChatListProps) {
  const { data: session } = useSession();

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const role = session?.user?.role || "PARENT";
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "PARENT" ? "#FFFFFF" : "#282828";
  const [showNewChat, setShowNewChat] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string; role?: string }[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersQuery, setUsersQuery] = useState('');

  useEffect(() => {
    if (!showNewChat) return;
    let cancelled = false;
    const load = async () => {
      setUsersLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        });
        const d = await res.json();
        if (cancelled) return;
        const list = Array.isArray(d.data)
          ? d.data.map((u: unknown) => {
              const uu = u as { id: string; name: string; role?: string };
              return { id: uu.id, name: uu.name, role: uu.role };
            })
          : [];
        const currentRole = session?.user?.role;
        const allowedRole = currentRole === 'PARENT' ? 'TEACHER' : currentRole === 'TEACHER' ? 'PARENT' : null;
        const filtered = list.filter((u) => u.id !== session?.user?.id && (allowedRole ? u.role === allowedRole : false));
        setUsers(filtered);
      } catch (err) {
        console.error('Failed to load users', err);
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [showNewChat, session?.accessToken, session?.user?.id, session?.user?.role]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        const data = await res.json();
        const convMap: Record<string, Chat> = {};
        const unreadCount: Record<string, number> = {};
        const currentUserId = session?.user?.id;

        (data.data as Chat[]).forEach((chat) => {
          const otherId = chat.senderId === currentUserId ? chat.receiverId : chat.senderId;

          if (chat.receiverId === currentUserId && !chat.isRead) {
            unreadCount[otherId] = (unreadCount[otherId] || 0) + 1;
          }

          const existing = convMap[otherId];
          if (!existing) {
            convMap[otherId] = { ...chat };
          } else {
            const existingTime = new Date(existing.createdAt).getTime();
            const chatTime = new Date(chat.createdAt).getTime();
            if (chatTime > existingTime) {
              convMap[otherId] = { ...chat };
            }
          }
        });

        Object.keys(convMap).forEach((otherId) => {
          convMap[otherId].messageCount = unreadCount[otherId] || 0;
        });

        const all = Object.values(convMap);
        setChats(all);
      } catch {
        setChats([]);
      }
      setLoading(false);
    };
    if (session?.accessToken) fetchMessages();
  }, [session]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);
  
  const filteredChats = useMemo(() => {
    const q = (debouncedQuery || '').trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((chat) => {
      const senderName = (chat.sender?.name || '').toLowerCase();
      const receiverName = (chat.receiver?.name || '').toLowerCase();
      const body = (chat.body || '').toLowerCase();
      return senderName.includes(q) || receiverName.includes(q) || body.includes(q);
    });
  }, [chats, debouncedQuery]);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-xl">Daftar Pesan</h2>
        <button
          onClick={() => setShowNewChat(true)}
          className="text-xl p-2 rounded-lg text-white hover:opacity-90 transition flex items-center gap-2 cursor-pointer"
          style={{ background: accentColor, color: textColor }}
          title="Mulai chat baru"
        >
          <RiChatNewFill />
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari Pesan"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-1"
        />
      </div>
      <div className="flex flex-col">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Memuat pesan...</div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Tidak ada pesan</div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-8 text-gray-400">{query ? 'Tidak ada hasil pencarian' : 'Tidak ada pesan'}</div>
        ) : (
          filteredChats.map((chat) => (
            <button key={chat.id}
              className="py-2 first:border-t border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition w-full"
              onClick={() => onSelectChat(chat)}>
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center relative">
                  <Image src={"/default-user.png"} alt="Foto Profil" width={60} height={60} className="rounded-full object-cover mr-3 border"/>
                  <div className="w-4 h-4 rounded-full bg-green-500 absolute bottom-0 right-0 border-2 border-white"></div>
                </div>
                <div className="text-left overflow-hidden w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">
                      {chat.senderId === session?.user?.id
                        ? chat.receiver.name
                        : chat.sender.name}
                    </h3>
                    <p className="text-xs text-gray-500 px-2 py-1 rounded-lg font-bold">
                      {new Date(chat.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{chat.body}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {showNewChat && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Mulai Chat Baru</h3>
              <button onClick={() => setShowNewChat(false)} className="text-gray-500">
                <FiX />
              </button>
            </div>

            <div className="mb-3">
              <input
                value={usersQuery}
                onChange={(e) => setUsersQuery(e.target.value)}
                placeholder="Cari pengguna..."
                className="w-full px-3 py-1.5 border rounded-md"
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              {usersLoading ? (
                <div className="text-center text-gray-500 py-6">Memuat pengguna...</div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-500 py-6">Tidak ada pengguna untuk diajak chat.</div>
              ) : (
                (users.filter(u => u.name.toLowerCase().includes(usersQuery.trim().toLowerCase()))).map((u) => (
                  <button key={u.id} onClick={() => {
                    const tempChat: Chat = {
                      id: `new-${u.id}`,
                      title: `Chat dengan ${u.name}`,
                      body: "",
                      isRead: false,
                      senderId: session?.user?.id || '',
                      receiverId: u.id,
                      createdAt: new Date().toISOString(),
                      sender: { id: session?.user?.id || '', name: session?.user?.name || 'Saya', role: session?.user?.role || 'PARENT' },
                      receiver: { id: u.id, name: u.name, role: u.role || 'PARENT' }
                    };
                    onSelectChat(tempChat);
                    setShowNewChat(false);
                  }} className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3 cursor-pointer ">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">{u.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-gray-400">{u.role || ''}</div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="mt-3 text-right">
              <button onClick={() => setShowNewChat(false)} className="px-4 py-2 rounded-md bg-gray-100">Batal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}