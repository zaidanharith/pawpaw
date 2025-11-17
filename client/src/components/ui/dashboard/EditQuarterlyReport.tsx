import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { AxiosError } from "axios";

interface QuarterlyReport {
  id: string;
  studentName: string;
  studentNumber: string;
  className: string;
  quarter: string;
  year: number;
  teacherName: string;
  notes: string;
  activitiesSummary: string[];
  meetingReminder: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface EditFormData {
  quarter: string;
  year: number;
  activitiesSummary: string;
  notes: string;
  meetingReminder: boolean;
}

const QUARTER_OPTIONS = [
  { value: "Q1", label: "Q1 (Januari - Maret)" },
  { value: "Q2", label: "Q2 (April - Juni)" },
  { value: "Q3", label: "Q3 (Juli - September)" },
  { value: "Q4", label: "Q4 (Oktober - Desember)" },
];

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface EditQuarterlyReportProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: QuarterlyReport | null;
  onSave: () => void;
}

const EditQuarterlyReport: React.FC<EditQuarterlyReportProps> = ({
  isOpen,
  onClose,
  reportData,
  onSave,
}) => {
  const [formData, setFormData] = useState<EditFormData>({
    quarter: "Q1",
    year: new Date().getFullYear(),
    activitiesSummary: "",
    notes: "",
    meetingReminder: false,
  });
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = (session?.user?.role || "ADMIN").toUpperCase();
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  useEffect(() => {
    if (!reportData) return;

    setFormData({
      quarter: reportData.quarter || "Q1",
      year: reportData.year || new Date().getFullYear(),
      activitiesSummary: reportData.activitiesSummary?.join("\n") || "",
      notes: reportData.notes || "",
      meetingReminder: reportData.meetingReminder || false,
    });
  }, [reportData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "year") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportData) {
      alert("Data laporan tidak ditemukan.");
      return;
    }

    if (!formData.quarter || !formData.notes) {
      alert("Mohon lengkapi semua field yang wajib.");
      return;
    }

    if (!token) {
      alert("Token tidak ditemukan. Coba login ulang.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        quarter: formData.quarter,
        year: formData.year,
        activitiesSummary: formData.activitiesSummary
          .split("\n")
          .filter((line) => line.trim()),
        notes: formData.notes,
        meetingReminder: formData.meetingReminder,
      };

      await api.put(`/quarterly-reports/${reportData.id}`, payload);

      onSave();
      onClose();
    } catch (error: unknown) {
      let message = "Gagal memperbarui laporan triwulan";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      console.error("EDIT REPORT ERROR:", error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !reportData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* CARD */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div
          className="p-6 border-b border-gray-100 flex justify-between items-center"
          style={{ backgroundColor: accentColor }}
        >
          <h2
            className="text-xl font-bold text-gray-800"
            style={{ color: textColor }}
          >
            Edit Laporan Triwulan
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

        {/* BODY FORM */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Siswa
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {reportData.studentName}
            </p>
            <p className="text-sm text-gray-600">
              {reportData.studentNumber} | {reportData.className}
            </p>
          </div>

          <form id="edit-quarterly-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Quarter */}
            <div>
              <label
                htmlFor="quarter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kuartal <span className="text-red-500">*</span>
              </label>
              <select
                id="quarter"
                name="quarter"
                value={formData.quarter}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              >
                {QUARTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tahun <span className="text-red-500">*</span>
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>

            {/* Activities Summary */}
            <div>
              <label
                htmlFor="activitiesSummary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ringkasan Aktivitas (pisahkan dengan baris baru)
              </label>
              <textarea
                id="activitiesSummary"
                name="activitiesSummary"
                value={formData.activitiesSummary}
                onChange={handleChange}
                rows={3}
                placeholder="Contoh:&#10;- Siswa aktif dalam kegiatan senam&#10;- Partisipasi bagus dalam bermain"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              />
              <p className="text-xs text-gray-500 mt-1">
                Setiap baris akan menjadi satu poin aktivitas
              </p>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Catatan & Evaluasi Perkembangan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tuliskan evaluasi perkembangan siswa secara detail..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              />
            </div>

            {/* Meeting Reminder */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <input
                type="checkbox"
                id="meetingReminder"
                name="meetingReminder"
                checked={formData.meetingReminder}
                onChange={handleChange}
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="meetingReminder"
                className="cursor-pointer text-sm text-gray-700"
              >
                📅 Tandai untuk pertemuan orang tua 3 bulan (triwulan)
              </label>
            </div>
          </form>
        </div>

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
            form="edit-quarterly-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg shadow-md hover:opacity-80 transition"
            style={{ backgroundColor: accentColor, color: textColor }}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuarterlyReport;