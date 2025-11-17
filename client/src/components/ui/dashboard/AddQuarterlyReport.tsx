import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

interface AddFormData {
  studentId: string;
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

interface AddQuarterlyReportProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const initialForm: AddFormData = {
  studentId: "",
  quarter: "Q1",
  year: new Date().getFullYear(),
  activitiesSummary: "",
  notes: "",
  meetingReminder: false,
};

const AddQuarterlyReport: React.FC<AddQuarterlyReportProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AddFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = (session?.user?.role || "ADMIN").toUpperCase();
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  // Fetch students list when modal opens
  React.useEffect(() => {
    if (!isOpen) return;

    const fetchStudents = async () => {
      try {
        const res = await api.get("/student");
        setStudents(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

    if (!formData.studentId || !formData.quarter || !formData.notes) {
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
        student: formData.studentId,
        quarter: formData.quarter,
        year: formData.year,
        activitiesSummary: formData.activitiesSummary
          .split("\n")
          .filter((line) => line.trim()),
        notes: formData.notes,
        meetingReminder: formData.meetingReminder,
      };

      await api.post("/quarterly-reports", payload);

      onSave();
      setFormData(initialForm);
      onClose();
    } catch (error: any) {
      console.error("ADD REPORT ERROR:", error?.response || error);
      alert(error?.response?.data?.message || "Gagal menambah laporan triwulan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* CARD */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div
          className="p-6 border-gray-100 rounded-t-2xl flex justify-between items-center"
          style={{ backgroundColor: accentColor }}
        >
          <h2
            className="text-xl font-bold text-gray-800"
            style={{ color: textColor }}
          >
            Tambah Laporan Triwulan Baru
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
          <form id="add-quarterly-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Student Select */}
            <div>
              <label
                htmlFor="studentId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pilih Siswa <span className="text-red-500">*</span>
              </label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:outline-none"
                style={
                  { "--tw-ring-color": accentColor } as React.CSSProperties
                }
              >
                <option value="">-- Pilih Siswa --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.studentNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Quarter Select */}
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
                style={
                  { "--tw-ring-color": accentColor } as React.CSSProperties
                }
              >
                {QUARTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Select */}
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
                style={
                  { "--tw-ring-color": accentColor } as React.CSSProperties
                }
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
                placeholder="Contoh:&#10;- Siswa aktif dalam kegiatan senam&#10;- Partisipasi bagus dalam bermain&#10;- Mau berbagi mainan"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={
                  { "--tw-ring-color": accentColor } as React.CSSProperties
                }
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
                style={
                  { "--tw-ring-color": accentColor } as React.CSSProperties
                }
              />
            </div>

            {/* Meeting Reminder Checkbox */}
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
            form="add-quarterly-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg text-gray-800 shadow-md hover:opacity-80 transition"
            style={{ backgroundColor: accentColor, color: textColor }}
          >
            {loading ? "Menyimpan..." : "Simpan Laporan Triwulan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuarterlyReport;