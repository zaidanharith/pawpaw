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

interface QuarterlyReportPageProps {
  accentColor: string;
  textColor: string;
  isParent: boolean;
}

const QuarterlyReportPage: FC<QuarterlyReportPageProps> = ({
  accentColor,
  textColor,
  isParent,
}) => {
  const [reports, setReports] = useState<QuarterlyReport[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] =
    useState<QuarterlyReport | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] =
    useState<QuarterlyReport | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken;

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

  const handleDownloadPdf = async (id: string, classroomName: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/report/${id}/pdf`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quarterly-report-${classroomName}-${Date.now()}.pdf`;
      a.click();
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

      {/* SUMMARY CARD */}
      <div className="flex items-center justify-between">

        {/* LEFT CARD */}
        <div
          className="rounded-xl flex items-center gap-4 border bg-white"
          style={{
            borderColor: accentColor,
            height: "82px",
            padding: "0 16px",
          }}
        >
          {/* DATE BOX */}
          <div
            className="rounded-lg flex flex-col items-center justify-center"
            style={{
              backgroundColor: accentColor,
              width: "150px",
              height: "60px",
            }}
          >
            <p className="text-white font-bold text-lg leading-tight">
              {formattedDay}
            </p>
            <p className="text-white text-sm mt-1 leading-tight font-medium">
              {formattedDate}
            </p>
          </div>

          {/* TOTAL */}
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-black text-base leading-tight">
              Total Laporan Hari Ini
            </p>
            <p className="text-3xl font-extrabold text-black text-center mt-0.5">
              {todayCount}
            </p>
          </div>
        </div>

        {/* CREATE BUTTON */}
        {!isParent && (
          <button
            onClick={() => {
              setEditingReport(null);
              setIsFormOpen(true);
            }}
            style={{ backgroundColor: accentColor }}
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-white font-semibold hover:shadow-lg"
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
          textColor={textColor}
        />
      )}

      {/* DETAIL MODAL */}
      {selectedReport && (
        <DetailQuarterlyReport
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          accentColor={accentColor}
          textColor={textColor}
          isParent={isParent}
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
                  <td className="px-6 py-4">
                    {report.quarter} {report.year}
                  </td>

                  <td className="px-6 py-4 max-w-xs">
                    <p className="line-clamp-2">
                      {report.notes ?? report.title ?? "-"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(report.createdAt).toLocaleDateString("id-ID")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
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

                      {!isParent && (
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