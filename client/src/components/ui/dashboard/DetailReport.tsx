import React from "react";
import { MdOutlineClose, MdEdit, MdDelete } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { useSession } from "next-auth/react";
import type { Report } from "./ReportPage";

interface ReportDetailProps {
  isOpen: boolean;
  report: Report | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isReadOnly?: boolean;
}

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

const kegiatanLabels: Record<string, string> = {
  SENAM: "Senam",
  BERMAIN: "Bermain",
  BERCERITA: "Bercerita",
  MAKAN: "Makan Siang",
};

const ReportDetail: React.FC<ReportDetailProps> = ({
  isOpen,
  report,
  onClose,
  onEdit,
  onDelete,
  isReadOnly = false,
}) => {
  const { data: session } = useSession();
  const role = session?.user?.role || "ADMIN";
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";

  if (!isOpen || !report) return null;

  const rawDate = report.date || report.createdAt;
  const dateObj = rawDate ? new Date(rawDate) : null;

  const timeStr =
    dateObj?.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) ?? "-";

  const fullDateStr =
    dateObj?.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) ?? "-";

  let relativeStr = "-";
  if (dateObj) {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) relativeStr = "Baru saja";
    else if (diffMins < 60) relativeStr = `${diffMins} menit yang lalu`;
    else if (diffHours < 24) relativeStr = `${diffHours} jam yang lalu`;
    else relativeStr = `${diffDays} hari yang lalu`;
  }

  const rawActivityName = report.activities?.[0]?.name || "";
  const activityDisplay =
    kegiatanLabels[rawActivityName] || rawActivityName || "Kegiatan Harian";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const rawPath = report.photos?.[0]?.path || null;
  let photoUrl: string | null = null;

  if (rawPath) {
    if (!rawPath.startsWith("http")) {
      const cleaned = rawPath.replace(/^public[\\/]/, "");
      photoUrl = `${API_URL}/${cleaned}`;
    } else {
      photoUrl = rawPath;
    }
  }

  const hasPhoto = Boolean(photoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* CARD */}
      <div className="relative bg-white rounded-2xl w-full max-w-[650px] mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* =======================
            HEADER
        ======================== */}
        <div
          className="relative px-4 py-2 flex items-center justify-center"
          style={{ backgroundColor: accentColor }}
        >
          {/* TITLE */}
          <div className="flex flex-col items-center">
            <h2 className="font-bold text-lg"
            style={{color: textColor}}>
              Detail Laporan Kegiatan
            </h2>
            <p className="text-white/90 text-sm"
            style={{color: textColor}}>
              Informasi lengkap laporan
            </p>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute right-4 hover:opacity-80 transition"
            style={{ color: textColor }}
            title="Tutup"
          >
            <MdOutlineClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* =======================
            BODY – flex-1 + overflow-y-auto
        ======================== */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title + Time */}
          <div className="text-center space-y-1">
            <h3 className="font-bold text-xl text-gray-900">
              {report.title}
            </h3>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <FaClock />
              <span>{relativeStr}</span>
              <span>•</span>
              <span>{timeStr}</span>
              <span>|</span>
              <span>{fullDateStr}</span>
            </div>
          </div>

          {/* FOTO – tinggi dibatasi max-h-64 */}
          <div className="w-full rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center overflow-hidden max-h-64">
            {hasPhoto ? (
              <img
                src={photoUrl!}
                alt="Foto kegiatan"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 py-10">
                <span className="text-3xl mb-2">🖼</span>
                <span>Preview Foto Kegiatan</span>
              </div>
            )}
          </div>

          {/* Grid Kegiatan & Kelas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Nama Kegiatan</p>
              <p className="font-semibold text-gray-900 mt-1">
                {activityDisplay}
              </p>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="text-sm">
            <p className="text-gray-500 text-xs mb-1">Deskripsi Kegiatan</p>
            <p className="text-gray-800 leading-relaxed">
              {report.description || "Tidak ada deskripsi kegiatan."}
            </p>
          </div>
        </div>

        {/* =======================
            FOOTER BUTTONS (KOMPAK)
        ======================== */}
        {!isReadOnly && (
          <div className="px-6 pb-3 pt-2 flex justify-between gap-3">

            {/* EDIT */}
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 
                        px-4 py-2.5 rounded-full text-sm font-semibold 
                        shadow-md hover:opacity-80 transition cursor-pointer"
              style={{ backgroundColor: accentColor, color: textColor}}
            >
              <MdEdit/> Edit
            </button>

            {/* DELETE */}
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 
                        px-4 py-2.5 rounded-full text-white text-sm font-semibold 
                        bg-red-600 hover:bg-red-700 transition cursor-pointer"
            >
              <MdDelete/> Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetail;
