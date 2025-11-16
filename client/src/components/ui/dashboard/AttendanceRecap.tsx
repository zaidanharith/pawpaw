"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Classroom {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  classroom?: { id: string; name: string } | null;
  classroomId?: string;
}

interface RawAttendance {
  id: string;
  date: string;
  status?: string | null;
  notes?: string | null;
}

interface RecapRow {
  studentId: string;
  name: string;
  sick: number;
  permission: number;
  absent: number;
  present: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ⭐ FIX NORMALIZER — aman dari error dan tidak akan return never
function normalizeFromBackendStatus(s: string | null | undefined): string {
  if (!s) return "hadir"; // default hadir
  const v = String(s).trim().toLowerCase();

  if (v.includes("sakit") || v === "sick") return "sakit";
  if (v.includes("izin") || v === "permission") return "izin";
  if (v.includes("alfa") || v.includes("alpha") || v.includes("absent")) return "alpha";
  if (v.includes("hadir") || v.includes("present")) return "hadir";

  return "hadir"; // fallback
}

export default function AttendanceRecap() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });

  const [endDate, setEndDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const [loading, setLoading] = useState(false);
  const [recap, setRecap] = useState<RecapRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // GET Classroom tanpa any
  useEffect(() => {
    if (!token) return;

    const loadClassrooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/classroom`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data: Classroom[] = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setClassrooms(data);

        if (data.length > 0 && !selectedClassroom) {
          setSelectedClassroom(data[0].id);
        }
      } catch (err) {
        console.error("Gagal fetch classrooms", err);
        setClassrooms([]);
      }
    };

    loadClassrooms();
  }, [token]);

  // === GENERATE REKAP ===
  const handleGenerate = async () => {
    setError(null);

    if (!token) return setError("Token tidak ditemukan, silakan login ulang.");
    if (!selectedClassroom) return setError("Pilih kelas terlebih dahulu.");

    setLoading(true);

    try {
      // 1. GET semua siswa
      const studentsRes = await axios.get(`${API_URL}/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allStudents: Student[] = Array.isArray(studentsRes.data?.data)
        ? studentsRes.data.data
        : [];

      // 2. Filter berdasarkan kelas
      const studentsInClass = allStudents.filter(
        (s) =>
          s.classroom?.id === selectedClassroom ||
          s.classroomId === selectedClassroom
      );

      const start = new Date(startDate + "T00:00:00");
      const end = new Date(endDate + "T23:59:59");

      // 3. Proses paralel
      const recapRows = await Promise.all(
        studentsInClass.map(async (std): Promise<RecapRow> => {
          const res = await axios.get(
            `${API_URL}/attendance/student/${std.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const raw: RawAttendance[] = Array.isArray(res.data?.data)
            ? res.data.data
            : [];

          let sick = 0;
          let permission = 0;
          let absent = 0;
          let present = 0;

          raw.forEach((att) => {
            if (!att.date) return;

            const d = new Date(att.date);
            if (isNaN(d.getTime())) return;
            if (d < start || d > end) return;

            const norm = normalizeFromBackendStatus(att.status);

            if (norm === "sakit") sick++;
            else if (norm === "izin") permission++;
            else if (norm === "alpha") absent++;
            else present++;
          });

          return {
            studentId: std.id,
            name: std.name,
            sick,
            permission,
            absent,
            present,
          };
        })
      );

      recapRows.sort((a, b) => a.name.localeCompare(b.name));
      setRecap(recapRows);
    } catch (err) {
      console.error("Gagal generate rekap:", err);
      setError("Gagal generate rekap, cek console.");
    } finally {
      setLoading(false);
    }
  };

  const show = (n: number) => (n > 0 ? n : "-");

  return (
    <section className="bg-white rounded-xl shadow p-5 space-y-4">
      {/* FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Kelas:</label>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Pilih Kelas --</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Tanggal Mulai:</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tanggal Akhir:</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow"
          >
            {loading ? "Memproses..." : "Generate"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {/* TABEL */}
      <div className="mt-4">
        <div className="bg-blue-600 text-white px-3 py-2 rounded-t-md font-semibold">
          Rekap Absensi Siswa
        </div>

        <table className="w-full text-sm border rounded-b-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">No</th>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-center">Sakit</th>
              <th className="p-2 text-center">Izin</th>
              <th className="p-2 text-center">Alpha</th>
              <th className="p-2 text-center">Hadir</th>
            </tr>
          </thead>

          <tbody>
            {recap.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 text-center text-gray-500"
                >
                  Klik Generate untuk menampilkan rekap.
                </td>
              </tr>
            ) : (
              recap.map((r, i) => (
                <tr key={r.studentId} className={i % 2 ? "bg-gray-50" : ""}>
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2 text-center text-orange-600 font-semibold">{show(r.sick)}</td>
                  <td className="p-2 text-center">{show(r.permission)}</td>
                  <td className="p-2 text-center">{show(r.absent)}</td>
                  <td className="p-2 text-center">{show(r.present)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}