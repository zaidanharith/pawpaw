"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";

interface SessionUser {
  id: string;
  username: string;
  role: "ADMIN" | "TEACHER" | "PARENT";
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phoneNumber?: string | null; 
}

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose, onSave }) => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role || "ADMIN";
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
  }>({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
  });

  // Fetch data profil terbaru dari API saat modal dibuka
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOpen && token) {
        setFetchingData(true);
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = response.data.data || response.data;
          
          setFormData({
            name: userData.name || "",
            username: userData.username || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          // Fallback ke data session jika fetch gagal
          if (session?.user) {
            setFormData({
              name: session.user.name || "",
              username: session.user.username || "",
              email: session.user.email || "",
              phoneNumber: (session.user as any).phoneNumber || "",
            });
          }
        } finally {
          setFetchingData(false);
        }
      }
    };

    fetchProfileData();
  }, [isOpen, token, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Token tidak ditemukan. Coba login ulang.");
      return;
    }

    if (
      !formData.name ||
      !formData.username ||
      !formData.email
    ) {
      alert("Mohon lengkapi semua field wajib (Nama, Username, Email).");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully");
      onSave();
      setTimeout(() => {
        onClose();
      },500);
    } catch (error: any) {
      console.error("EDIT PROFILE ERROR:", error?.response || error);
      setMessage(error?.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* CARD: MAX HEIGHT + SCROLL DI DALAM */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div
          className="p-6 border-b border-gray-100 flex justify-between items-center"
          style={{ backgroundColor: accentColor }}
        >
          <h2 className="text-xl font-bold" style={{ color: textColor }}>
            Edit Profil
          </h2>
          <button
            onClick={onClose}
            className="hover:opacity-80 transition"
            style={{ color: textColor }}
            title="Close"
            type="button"
          >
            <MdOutlineClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* BODY FORM: SCROLLABLE */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon <span className="text-gray-400 text-xs"></span>
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Contoh: 08123456789"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg shadow-md hover:opacity-80 transition disabled:opacity-50"
              style={{ backgroundColor: accentColor, color: textColor }}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;