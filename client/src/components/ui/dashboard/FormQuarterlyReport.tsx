"use client";

import { FC, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

interface QuarterlyReportEditing {
  id?: string;
}

interface FormQuarterlyReportProps {
  onClose: (reload?: boolean) => void;
  editingReport?: QuarterlyReportEditing | null;
  isOpen?: boolean;
  accentColor: string;
  textColor: string;
}

const FormQuarterlyReport: FC<FormQuarterlyReportProps> = ({
  onClose,
  editingReport,
  isOpen = true,
  accentColor,
  textColor,
}) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    quarter: "",
    title: "",
    meetingDate: "",
  });

  // LOAD DATA WHEN EDIT
  useEffect(() => {
    if (!isOpen || !editingReport?.id || !token) return;

    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${API_URL}/report/${editingReport.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = res.data.data;

        setFormData({
          quarter: d.quarter || "",
          title: d.title || "",
          meetingDate: d.meetingDate
            ? new Date(d.meetingDate).toISOString().split("T")[0]
            : "",
        });
      } catch {
        toast.error("Gagal memuat laporan");
      }
    };

    fetchData();
  }, [isOpen, editingReport?.id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      let res;

      if (editingReport?.id) {
        res = await axios.put(
          `${API_URL}/report/${editingReport.id}`,
          {
            title: formData.title,
            meetingDate: new Date(formData.meetingDate),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(`${API_URL}/report`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (res.data.success) {
        toast.success(
          editingReport ? "Laporan diperbarui" : "Laporan berhasil dibuat"
        );
        onClose(true);
      }
    } catch {
      toast.error("Gagal menyimpan laporan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-20">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div
          className="w-full px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: accentColor }}
        >
          <h2 className="text-lg font-semibold" style={{ color: textColor }}>
            {editingReport ? "Edit Laporan Triwulan" : "Tambah Laporan Triwulan"}
          </h2>

          <button
            onClick={() => onClose(false)}
            className="p-2 rounded-lg hover:bg-white/20 transition"
          >
            <X size={22} color={textColor} />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {editingReport && (
              <div>
                <label className="text-sm font-medium">Kuartal</label>
                <input
                  disabled
                  value={formData.quarter}
                  className="mt-2 px-4 py-2 w-full bg-gray-100 border rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Judul *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-2 px-4 py-2 w-full border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Meeting *</label>
              <input
                type="date"
                value={formData.meetingDate}
                onChange={(e) =>
                  setFormData({ ...formData, meetingDate: e.target.value })
                }
                className="mt-2 px-4 py-2 w-full border rounded-lg"
                required
              />
            </div>

            {/* FOOTER */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="flex-1 border rounded-lg py-2 bg-gray-100"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: accentColor }}
                className="flex-1 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
              >
                {loading
                  ? "Menyimpan..."
                  : editingReport
                  ? "Perbarui"
                  : "Buat Laporan"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default FormQuarterlyReport;