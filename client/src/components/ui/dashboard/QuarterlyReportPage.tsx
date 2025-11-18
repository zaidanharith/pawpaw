"use client";

import { FC, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import DetailQuarterlyReport from "./DetailQuarterlyReport";
import FormQuarterlyReport from "./FormQuarterlyReport";

import { Download, Edit, Plus, Trash2 } from "lucide-react";

export interface QuarterlyReport {
  id: string;
  quarter: string;
  year: number;
  title?: string;
  meetingDate?: string;
  notes?: string;
  activitiesSummary?: string[];
  createdAt: string;
  updatedAt: string;
  classroom?: {
    id: string;
    name: string;
    teacher: {
      name: string;
      email: string;
    };
  } | null;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const QuarterlyReportPage: FC = () => {
  const [reports, setReports] = useState<QuarterlyReport[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState<QuarterlyReport | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<QuarterlyReport | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role || "ADMIN";

  const accentColor = roleColors[role] || roleColors.ADMIN;

  const fetchReports = async () => {
    try {
      setLoading(true);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/report`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus laporan ini?")) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/report/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Laporan berhasil dihapus");
        setReports((prev) => prev.filter((r) => r.id !== id));
        setSelectedReport(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus laporan");
    }
  };

  const handleDownloadPdf = async (id: string, name: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/report/${id}/pdf`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
          params: { name },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `quarterly-report-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF berhasil diunduh");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunduh PDF");
    }
  };

  const openCreateForm = () => {
    setEditingReport(null);
    setIsFormOpen(true);
  };

  const openEditForm = (report: QuarterlyReport) => {
    setEditingReport(report);
    setIsFormOpen(true);
  };

  const handleFormClosed = (shouldReload?: boolean) => {
    setIsFormOpen(false);
    setEditingReport(null);
    if (shouldReload) fetchReports();
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
      <div className="flex items-center justify-between">
        {(role !== "PARENT") && (
          <button
            onClick={openCreateForm}
            style={{ backgroundColor: accentColor }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:shadow-lg cursor-pointer"
          >
            <Plus size={20} />
            Buat Laporan Baru
          </button>
        )}
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <FormQuarterlyReport
          onClose={handleFormClosed}
          editingReport={editingReport}
          accentColor={accentColor}
          textColor="#282828"
        />
      )}

      {/* DETAIL MODAL */}
      {selectedReport && (
        <DetailQuarterlyReport
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          accentColor={accentColor}
          textColor="#282828"
          isParent={( role === "PARENT" )}
          onEdit={() => {
            openEditForm(selectedReport);
            setSelectedReport(null);
          }}
          onDelete={() => handleDelete(selectedReport.id)}
        />
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada laporan triwulan
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Kuartal
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Catatan
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.title ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.quarter} {report.year}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.classroom?.teacher?.name ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(report.createdAt).toLocaleDateString("id-ID")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          handleDownloadPdf(
                            report.id,
                            session?.user?.name || "User"
                          )
                        }
                        className="rounded p-2 text-blue-600 hover:bg-blue-100"
                        title="Unduh PDF"
                      >
                        <Download size={18} />
                      </button>

                      {(role !== "PARENT") && (
                        <>
                          <button
                            onClick={() => openEditForm(report)}
                            className="rounded p-2 text-yellow-600 hover:bg-yellow-100"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(report.id)}
                            className="rounded p-2 text-red-600 hover:bg-red-100"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
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

export default QuarterlyReportPage;