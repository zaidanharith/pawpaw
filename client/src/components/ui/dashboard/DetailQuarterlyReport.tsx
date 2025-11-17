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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="mb-4 text-2xl font-bold" style={{ color: textColor }}>
          Detail Laporan Triwulan
        </h2>

        <div className="space-y-3 text-sm text-gray-800">
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
            <p className="mt-1 whitespace-pre-wrap">{report.notes}</p>
          </div>

          {report.activitiesSummary && report.activitiesSummary.length > 0 && (
            <div>
              <strong>Ringkasan Kegiatan:</strong>
              <ul className="ml-5 mt-1 list-disc">
                {report.activitiesSummary.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {!isParent && (
          <div className="mt-6 flex gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onEdit}
              style={{ backgroundColor: accentColor }}
              className="flex-1 rounded-lg py-2 text-sm font-semibold text-white"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white"
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