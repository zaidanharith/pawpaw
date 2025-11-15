import { FiFileText, FiImage } from "react-icons/fi";

interface LiveReportCardProps {
  studentName: string;
  className: string;
  activityTitle: string;
  activityDescription: string;
  hasPhotos?: boolean;
}

export default function LiveReportCard({
  studentName,
  className,
  activityTitle,
  activityDescription,
  hasPhotos = false,
}: LiveReportCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{studentName}</h3>
          <p className="text-gray-700 text-sm">{activityTitle}</p>
        </div>
        <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {className}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{activityDescription}</p>

      <div className="space-y-3">
        {hasPhotos && (
          <div className="flex items-center gap-2 text-gray-600">
            <FiImage size={16} />
            <span className="text-sm">Foto Kegiatan</span>
          </div>
        )}
        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Lihat Detail Laporan
        </button>
      </div>
    </div>
  );
}