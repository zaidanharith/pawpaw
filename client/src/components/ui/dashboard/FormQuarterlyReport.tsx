"use client";

import { FC, useState, useEffect } from "react";
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
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    quarter: "",
    title: "",
    meetingDate: "",
  });
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setFormData({ quarter: "", title: "", meetingDate: "" }), 0);
      return () => clearTimeout(t);
    }
    return;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      if (!editingReport?.id) return;
      if (!token) return;
      setFetching(true);

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
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat laporan");
      }

      setFetching(false);
    };

    if (editingReport?.id) fetchData();
  }, [isOpen, editingReport?.id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingReport) {
      if (!formData.title || !formData.meetingDate) {
        toast.error("Judul dan tanggal meeting wajib diisi");
        return;
      }
    }

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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        alert(JSON.stringify(formData));
        res = await axios.post(
          `${API_URL}/report`,formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (res.data.success) {
        toast.success(
          editingReport ? "Laporan diperbarui" : "Laporan berhasil dibuat"
        );
        onClose(true);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal menyimpan laporan");
      } else {
        toast.error("Gagal menyimpan laporan");
      }
    }

    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">Memuat data...</div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="relative w-full max-w-xl bg-white rounded-xl p-6 shadow-lg">
        <button
          onClick={() => onClose(false)}
          className="absolute right-4 top-4 text-gray-400 hover:bg-gray-100 p-2 rounded-lg"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-bold" style={{ color: textColor }}>
          {editingReport ? "Edit Laporan Triwulan" : "Buat Laporan Triwulan"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* QUARTER (READ ONLY FOR EDIT) */}
          {editingReport && (
            <div>
              <label className="text-sm font-semibold">Kuartal</label>
              <input
                disabled
                value={formData.quarter}
                className="mt-2 px-4 py-2 w-full bg-gray-100 border rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold">Judul *</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              className="mt-2 px-4 py-2 w-full border rounded-lg"
              required={!!editingReport}
            />
          </div>

          {/* MEETING DATE */}
          <div>
            <label className="text-sm font-semibold">Tanggal Meeting *</label>
            <input
              name="meetingDate"
              type="date"
              value={formData.meetingDate}
              onChange={(e) =>
                setFormData((p) => ({ ...p, meetingDate: e.target.value }))
              }
              className="mt-2 px-4 py-2 w-full border rounded-lg"
              required={!!editingReport}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 border-t pt-6">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 border rounded-lg py-2 bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: accentColor }}
              className="flex-1 py-2 rounded-lg text-white disabled:opacity-50"
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
  );
};

export default FormQuarterlyReport;