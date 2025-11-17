"use client";

import { FC, useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Download, Plus, Trash2 } from "lucide-react";

interface QuarterlyReport {
  id: string;
  classroomId: string;
  classroom?: {
    id: string;
    name: string;
    teacher?: {
      name: string;
      email: string;
    };
  } | null;
  quarter: string;
  year: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface QuarterlyReportListProps {
  accentColor: string;
  textColor: string;
  isParent: boolean;
}

const QuarterlyReportList: FC<QuarterlyReportListProps> = ({
  accentColor,
  textColor,
  isParent,
}) => {
  const [reports, setReports] = useState<QuarterlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    classroomId: "",
    notes: "",
  });

  useEffect(() => {
    fetchReports();
    if (!isParent) {
      fetchClassrooms();
    }
  }, [isParent]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/report");

      if (response.data.success) {
        console.log("REPORT DATA:", response.data.data);
        setReports(response.data.data);
      }
    } catch (error) {
      toast.error("Gagal mengambil laporan");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await api.get("/classroom");
      if (response.data.success) {
        setClassrooms(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.classroomId) {
      toast.error("Pilih kelas terlebih dahulu");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/report", {
        classroomId: formData.classroomId,
        notes: formData.notes,
      });

      if (response.data.success) {
        toast.success("Laporan triwulan berhasil dibuat");
        setIsFormOpen(false);
        setFormData({ classroomId: "", notes: "" });
        fetchReports();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat laporan");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus laporan ini?")) return;

    try {
      const response = await api.delete(`/report/${id}`);
      if (response.data.success) {
        toast.success("Laporan berhasil dihapus");
        setReports(reports.filter((r) => r.id !== id));
      }
    } catch (error) {
      toast.error("Gagal menghapus laporan");
      console.error(error);
    }
  };

  const handleDownloadPdf = async (id: string, classroomName: string) => {
    try {
      const response = await api.get(`/report/${id}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `quarterly-report-${classroomName}-${new Date().getTime()}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("PDF berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh PDF");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Memuat laporan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {!isParent ? (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: textColor }}>
            Laporan Triwulan
          </h2>
          <button
            onClick={() => setIsFormOpen(true)}
            style={{ backgroundColor: accentColor }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white hover:shadow-lg"
          >
            <Plus size={20} />
            Buat Laporan Baru
          </button>
        </div>
      ) : (
        <h2 className="text-2xl font-bold" style={{ color: textColor }}>
          Laporan Triwulan
        </h2>
      )}

      {/* Modal Create Report */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold" style={{ color: textColor }}>
              Buat Laporan Triwulan
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Classroom Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Pilih Kelas *
                </label>
                <select
                  value={formData.classroomId}
                  onChange={(e) =>
                    setFormData({ ...formData, classroomId: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border px-4 py-2"
                  required
                >
                  <option value="">-- Pilih Kelas --</option>
                  {classrooms.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border px-4 py-2"
                  placeholder="Catatan pertemuan dengan orang tua..."
                  rows={4}
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 rounded-lg border bg-gray-50 py-2"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  style={{ backgroundColor: accentColor }}
                  disabled={submitting}
                  className="flex-1 rounded-lg py-2 text-white disabled:opacity-50"
                >
                  {submitting ? "Membuat..." : "Buat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada laporan triwulan
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Kuartal
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Guru
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Catatan
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  {/* Classroom */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {report.classroom?.name ?? "-"}
                  </td>

                  {/* Quarter */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.quarter} {report.year}
                  </td>

                  {/* Teacher */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.classroom?.teacher?.name ?? "-"}
                  </td>

                  {/* Notes */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p className="line-clamp-2">{report.notes}</p>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(report.createdAt).toLocaleDateString("id-ID")}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">

                      {/* Download PDF */}
                      <button
                        onClick={() =>
                          handleDownloadPdf(
                            report.id,
                            report.classroom?.name ?? "report"
                          )
                        }
                        className="rounded p-2 text-blue-600 hover:bg-blue-100"
                      >
                        <Download size={18} />
                      </button>

                      {/* Delete */}
                      {!isParent && (
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="rounded p-2 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default QuarterlyReportList;