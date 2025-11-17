"use client";

import React from "react";
import { QuarterlyReport } from "./QuarterlyReportPage";

interface DetailQuarterlyReportProps {
  report: QuarterlyReport;
  onClose: () => void;
  accentColor: string;
  textColor: string;
  isParent: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DetailQuarterlyReport: React.FC<DetailQuarterlyReportProps> = ({
  report, onClose, accentColor, textColor, isParent, onEdit, onDelete
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-xl">
        <h2 className="text-xl font-bold">{report.studentName} - {report.quarter} {report.year}</h2>
        <p>Guru: {report.teacherName}</p>
        <p>Catatan: {report.notes}</p>

        {report.attendance && (
          <div className="mt-2">
            <strong>Rekap Kehadiran:</strong>
            <p>Hadir: {report.attendance.hadir}</p>
            <p>Sakit: {report.attendance.sakit}</p>
            <p>Izin: {report.attendance.izin}</p>
            <p>Alpha: {report.attendance.alpha}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          {!isParent && onEdit && (
            <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={onEdit}>Edit</button>
          )}
          {!isParent && onDelete && (
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={onDelete}>Hapus</button>
          )}
          <button className="px-3 py-1 bg-gray-300 text-gray-800 rounded" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default DetailQuarterlyReport;