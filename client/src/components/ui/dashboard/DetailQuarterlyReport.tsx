"use client";

import { FC } from "react";
import { QuarterlyReport } from "./QuarterlyReportPage";
import { X } from "lucide-react";

interface DetailQuarterlyReportProps {
  report: QuarterlyReport;
  onClose: () => void;
  accentColor: string;
  textColor: string;
  isParent: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DetailQuarterlyReport: FC<DetailQuarterlyReportProps> = ({
  report,
  onClose,
  accentColor,
  textColor,
  isParent,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div
          className="w-full px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: accentColor }}
        >
          <h2 className="text-lg font-semibold" style={{ color: textColor }}>
            Detail Laporan Triwulan
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition"
          >
            <X size={22} color={textColor} />
          </button>
        </div>

        <div className="p-6 space-y-3 text-sm text-gray-800">

          <p>
            <strong>Kelas:</strong> {report.classroom?.name ?? "-"}
          </p>
          <p>
            <strong>Guru:</strong> {report.classroom?.teacher?.name ?? "-"}
          </p>
          <p>
            <strong>Kuartal:</strong> {report.quarter} {report.year}
          </p>

          <div>
            <strong>Catatan:</strong>
            <p className="mt-1 whitespace-pre-wrap">{report.notes ?? "-"}</p>
          </div>

          {report.activitiesSummary?.length ? (
            <div>
              <strong>Ringkasan Kegiatan:</strong>
              <ul className="ml-5 mt-1 list-disc">
                {report.activitiesSummary.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {!isParent && (
          <div className="mt-6 flex gap-3 border-t p-6">
            <button
              type="button"
              onClick={onEdit}
              style={{ backgroundColor: accentColor }}
              className="flex-1 py-2 rounded-lg text-white font-semibold"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold"
            >
              Hapus
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DetailQuarterlyReport;