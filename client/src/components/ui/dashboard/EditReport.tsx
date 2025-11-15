import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from "next-auth/react";
import type { Report } from "./ReportPage";

interface EditFormData {
  judul: string;
  namaKegiatan: string;
  kelas: string;
  desc: string;
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

// ====== WARNA BERDASARKAN ROLE (SAMA DENGAN DetailReport) ======
const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface EditReportProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: Report | null;
  onSave: () => void;
}

const EditReport: React.FC<EditReportProps> = ({
  isOpen,
  onClose,
  reportData,
  onSave,
}) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const role = (session?.user as any)?.role || "ADMIN";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  const [formData, setFormData] = useState<EditFormData>({
    judul: "",
    namaKegiatan: "",
    kelas: "A1",
    desc: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!reportData) return;

    setFormData({
      judul: reportData.title || "",
      namaKegiatan: reportData.activities?.[0]?.name || "",
      kelas: (reportData as any).kelas || "A1",
      desc: reportData.description || "",
    });
    setPhotoFile(null);
  }, [reportData, isOpen]);

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

    if (!reportData) {
      alert("Data laporan tidak ditemukan.");
      return;
    }
    if (!token) {
      alert("Token tidak ditemukan. Coba login ulang.");
      return;
    }

    if (
      !formData.judul ||
      !formData.namaKegiatan ||
      !formData.kelas ||
      !formData.desc
    ) {
      alert("Mohon lengkapi semua field.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const payload = new FormData();
      payload.append("title", formData.judul);
      payload.append("description", formData.desc);
      payload.append("namaKegiatan", formData.namaKegiatan);
      payload.append("kelas", formData.kelas);

      if (photoFile) {
        payload.append("photo", photoFile);
      }

      await axios.put(`${API_URL}/livereport/${reportData.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onSave();
      onClose();
    } catch (error: any) {
      console.error("EDIT REPORT ERROR:", error?.response || error);
      alert(error?.response?.data?.message || "Gagal memperbarui laporan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !reportData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* CARD: MAX HEIGHT + SCROLL DI DALAM */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Edit Laporan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
            title="Close"
            type="button"
          >
            <MdOutlineClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* BODY FORM: SCROLLABLE */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
              required
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
              required
            >
              {KEGIATAN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
              required
            >
              {KELAS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
              rows={4}
              required
            />
          </div>

          <div>
            <label
              htmlFor="foto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ganti Foto Kegiatan (opsional)
            </label>
            <input
              type="file"
              id="foto"
              name="foto"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kalau tidak memilih file baru, foto lama akan tetap digunakan.
            </p>
          </div>
        </form>

        {/* FOOTER BUTTONS */}
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
            form="__dummy" // nggak perlu, kita pakai onSubmit di form di atas
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg text-gray-800 shadow-md hover:opacity-90 transition"
            style={{ backgroundColor: accentColor }}
            onClick={(e) => {
              // trigger submit manual karena form di atas pakai onSubmit
              const form = (e.currentTarget.closest("div")!
                .previousElementSibling as HTMLFormElement | null);
              form?.requestSubmit();
            }}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReport;
