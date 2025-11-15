import React, { useState } from "react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from "next-auth/react";

interface NewAnnouncementData {
  title: string;
  kelas: string;
  content: string;
}

const KELAS_OPTIONS = [
  { value: "A1", label: "A1" },
  { value: "B1", label: "B1" },
];

interface AddAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewAnnouncementData) => void;
}

const initialForm: NewAnnouncementData = {
  title: "",
  kelas: "A1",
  content: "",
};

// Warna untuk setiap role
const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

// FIX RESMI TANPA ANY — CSS VAR TAILWIND
type CSSVar = React.CSSProperties & {
  "--tw-ring-color"?: string;
};

const twRingColor = (color: string): CSSVar => ({
  "--tw-ring-color": color,
});

const AddAnnouncement: React.FC<AddAnnouncementProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<NewAnnouncementData>(initialForm);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const token = session?.accessToken;

  // Normalisasi role
  const role = (session?.user?.role || "ADMIN").toUpperCase();
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.kelas || !formData.content) {
      alert("Mohon lengkapi semua field.");
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      await axios.post(`${API_URL}/announcement/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSave(formData);
      setFormData(initialForm);
      onClose();
    } catch {
      alert("Gagal menambah pengumuman");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-lg">
        {/* HEADER */}
        <div
          className="p-6 border-b flex justify-between items-center"
          style={{ borderColor: accentColor }}
        >
          <h2 className="text-xl font-bold text-gray-800">
            Tambah Pengumuman Baru
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
            type="button"
          >
            <MdOutlineClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Pengumuman
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{
                borderColor: accentColor,
                ...twRingColor(accentColor),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kelas
            </label>
            <select
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              required
              className="w-full rounded-md px-3 py-2 bg-white focus:ring-2 focus:outline-none border"
              style={{
                borderColor: accentColor,
                ...twRingColor(accentColor),
              }}
            >
              {KELAS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Kegiatan
            </label>
            <input
              type="text"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{
                borderColor: accentColor,
                ...twRingColor(accentColor),
              }}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white transition shadow-md"
              style={{
                backgroundColor: accentColor,
                color: textColor,
              }}
            >
              {loading ? "Menyimpan..." : "Simpan Pengumuman Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncement;
