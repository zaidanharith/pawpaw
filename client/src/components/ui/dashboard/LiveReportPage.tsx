"use client";

import { useState } from "react";
import LiveReportFilter from "./LiveReportFilter";
import LiveReportCard from "./LiveReportCard";

interface Report {
  id: number;
  studentName: string;
  className: string;
  activityTitle: string;
  activityDescription: string;
  hasPhotos: boolean;
}

export default function LiveReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Dummy data - ganti dengan data dari API
  const reports: Report[] = [
    {
      id: 1,
      studentName: "Nayla Salsabila Putri",
      className: "Kelas A1",
      activityTitle: "Senam Bersama",
      activityDescription:
        "Nayla terlibat bersemangat mengikuti setiap gerakan senam",
      hasPhotos: true,
    },
    {
      id: 2,
      studentName: "Rico Halim",
      className: "Kelas A1",
      activityTitle: "Makan Siang",
      activityDescription:
        "Rico Halim melakukan makan siang bersama Rico Halim melakukan kegiatan belajar dengan baik",
      hasPhotos: true,
    },
    {
      id: 3,
      studentName: "Nayla Salsabila Putri",
      className: "Kelas A1",
      activityTitle: "Kegiatan Belajar",
      activityDescription:
        "Nayla terlibat bersemangat mengikuti kegiatan belajar dengan baik",
      hasPhotos: true,
    },
  ];

  // Filter data berdasarkan search dan date
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.className
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <LiveReportFilter
        onSearchChange={setSearchQuery}
        onDateChange={setDateFilter}
      />

      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <LiveReportCard
              key={report.id}
              studentName={report.studentName}
              className={report.className}
              activityTitle={report.activityTitle}
              activityDescription={report.activityDescription}
              hasPhotos={report.hasPhotos}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500">Tidak ada laporan yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}