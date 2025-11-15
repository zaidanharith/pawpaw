import { FiSearch, FiCalendar } from "react-icons/fi";

interface LiveReportFilterProps {
  onSearchChange?: (value: string) => void;
  onDateChange?: (value: string) => void;
}

export default function LiveReportFilter({
  onSearchChange,
  onDateChange,
}: LiveReportFilterProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-gray-900 font-semibold mb-4">Laporan Kegiatan Siswa</h2>
      
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari Kelas"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        {/* Date Input */}
        <div className="relative">
          <FiCalendar className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="dd/mm/yy"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            onChange={(e) => onDateChange?.(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}