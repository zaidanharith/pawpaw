"use client";

import { FC, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import DetailQuarterlyReport from "./DetailQuarterlyReport";
import FormQuarterlyReport from "./FormQuarterlyReport";

import { Download, Edit, Trash2, SquarePen } from "lucide-react";

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

  const [selectedReport, setSelectedReport] =
    useState<QuarterlyReport | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] =
    useState<QuarterlyReport | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role || "ADMIN";

  const accentColor = roleColors[role] || roleColors.ADMIN;

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch {
      toast.error("Gagal mengambil data laporan");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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
      }
    } catch {
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
    } catch {
      toast.error("Gagal mengunduh PDF");
    }
  };

  // SUMMARY DISPLAY
  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedDay = today.toLocaleDateString("id-ID", { weekday: "long" });

  const todayCount = reports.filter(
    (r) => new Date(r.createdAt).toDateString() === today.toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {(role !== "PARENT") && (
          <button
            onClick={() => {
              setEditingReport(null);
              setIsFormOpen(true);
            }}
            style={{ backgroundColor: accentColor }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition hover:shadow-lg cursor-pointer"
          >
            <SquarePen size={18} className="text-white" />
            Buat Laporan
          </button>
        )}
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <FormQuarterlyReport
          onClose={(reload) => {
            setIsFormOpen(false);
            setEditingReport(null);
            if (reload) fetchReports();
          }}
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
            setEditingReport(selectedReport);
            setSelectedReport(null);
            setIsFormOpen(true);
          }}
          onDelete={() => handleDelete(selectedReport.id)}
        />
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border bg-white">
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
                      >
                        <Download size={18} />
                      </button>

                      {(role !== "PARENT") && (
                        <>
                          <button
                            onClick={() => {
                              setEditingReport(report);
                              setIsFormOpen(true);
                            }}
                            className="rounded p-2 text-yellow-600 hover:bg-yellow-100"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(report.id)}
                            className="rounded p-2 text-red-600 hover:bg-red-100"
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