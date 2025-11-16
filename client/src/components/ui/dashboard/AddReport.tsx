import React, { useState } from "react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from "next-auth/react";
import { text } from "stream/consumers";

interface NewReportData {
  judul: string;
  namaKegiatan: string;
  kelas: string;
  desc: string;
  foto?: string;
}

const KEGIATAN_OPTIONS = [
  { value: "SENAM", label: "Senam" },
  { value: "BERMAIN", label: "Bermain" },
  { value: "BERCERITA", label: "Bercerita" },
  { value: "MAKAN", label: "Makan Siang" },
];

const KELAS_OPTIONS = [
  { value: "A1", label: "A1" },
  { value: "B1", label: "B1" },
];

// sama seperti di ReportPage / Detail / Edit
const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface AddReportProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const initialForm: NewReportData = {
  judul: "",
  namaKegiatan: KEGIATAN_OPTIONS[0].value,
  kelas: "A1",
  desc: "",
};

const AddReport: React.FC<AddReportProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<NewReportData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken;
  const teacherId = (session as any)?.user?.id;
  const role = (session?.user as any)?.role || "ADMIN";
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.judul ||
      !formData.namaKegiatan ||
      !formData.kelas ||
      !formData.desc ||
      !photoFile
    ) {
      alert("Mohon lengkapi semua field.");
      return;
    }

    if (!token) {
      alert("Token tidak ditemukan. Coba login ulang.");
      return;
    }

    if (!teacherId) {
      alert("ID guru tidak ditemukan. Coba login sebagai akun guru/admin.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const payload = new FormData();
      payload.append("title", formData.judul);
      payload.append("date", new Date().toISOString());
      payload.append("teacher", teacherId);
      payload.append("description", formData.desc);
      payload.append("namaKegiatan", formData.namaKegiatan);
      payload.append("kelas", formData.kelas);
      payload.append("photo", photoFile);

      await axios.post(`${API_URL}/livereport/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onSave();
      setFormData(initialForm);
      setPhotoFile(null);
      onClose();
    } catch (error) {
      const err = error as any;
      console.error("ERROR ADD REPORT:", err.response?.data || err);
      alert(err.response?.data?.message || "Gagal menambah laporan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* CARD: sama pola dengan DetailReport & EditReport */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6  border-gray-100 rounded-t-2xl flex justify-between items-center"
          style={{ backgroundColor: accentColor }}>
          <h2 className="text-xl font-bold text-gray-800"
            style={{ color: textColor }}>
            Tambah Laporan Baru
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

        {/* BODY SCROLL + FORM */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <form id="add-report-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="judul"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Judul Laporan
              </label>
              <input
                type="text"
                id="judul"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
              />
            </div>

            <div>
              <label
                htmlFor="namaKegiatan"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Kegiatan
              </label>
              <select
                id="namaKegiatan"
                name="namaKegiatan"
                value={formData.namaKegiatan}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:outline-none"
                style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
              >
                {KEGIATAN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="kelas"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kelas
              </label>
              <select
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:outline-none"
                style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
              >
                {KELAS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deskripsi Kegiatan
              </label>
              <textarea
                id="desc"
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
              />
            </div>

            <div>
              <label
                htmlFor="foto"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Foto Kegiatan
              </label>
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={{'--tw-ring-color': accentColor,} as React.CSSProperties}
              />
            </div>
          </form>
        </div>

        {/* FOOTER: tombol di luar area scroll */}
        <div className="px-6 pb-4 pt-2 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            form="add-report-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg text-gray-800 shadow-md hover:opacity-80 transition"
            style={{ backgroundColor: accentColor, color: textColor }}
          >
            {loading ? "Menyimpan..." : "Simpan Laporan Baru"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReport;
