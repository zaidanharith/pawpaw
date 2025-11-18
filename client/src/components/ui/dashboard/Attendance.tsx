"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { MdOutlineClose, MdEdit, MdDelete } from "react-icons/md";
import DeleteConfirmation from "../DeleteConfirmation";

interface Student {
  id: string;
  name: string;
}

type AttendanceStatus = "hadir" | "izin" | "sakit" | "alfa";

interface Attendance {
  id: string;
  studentId: string;
  status: AttendanceStatus;
  date: string;
  notes?: string | null;
  createdAt?: string;
}

interface RawAttendance {
  id: string;
  studentId: string;
  status: string;
  date: string;
  notes?: string | null;
  note?: string | null;
  createdAt?: string;
  created_at?: string;
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSaved?: () => void;
}

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};

const STATUS_OPTIONS = [
  { value: "HADIR", label: "Hadir" },
  { value: "IZIN", label: "Izin" },
  { value: "SAKIT", label: "Sakit" },
  { value: "ALFA", label: "Alfa" },
] as const;

// NORMALISASI STATUS DARI BACKEND
function normalizeStatusFromBackend(raw?: string | null): AttendanceStatus {
  if (!raw) return "hadir";
  const s = raw.toLowerCase();
  if (s.includes("hadir")) return "hadir";
  if (s.includes("izin")) return "izin";
  if (s.includes("sakit")) return "sakit";
  if (s.includes("alfa")) return "alfa";
  return "hadir";
}

// FRONTEND -> BACKEND ENUM
function convertStatusToBackend(s: AttendanceStatus): string {
  switch (s) {
    case "hadir": return "HADIR";
    case "izin": return "IZIN";
    case "sakit": return "SAKIT";
    case "alfa": return "ALFA";
    default: return String(s).toUpperCase();
  }
}

export default function AttendanceModal({
  isOpen,
  onClose,
  student,
  onSaved,
}: AttendanceModalProps) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const role = session?.user?.role || "ADMIN";
  const accentColor = roleColors[role];
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";

  const [form, setForm] = useState({
    status: "hadir" as AttendanceStatus,
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState<Attendance | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // LOAD DATA
  useEffect(() => {
    if (!isOpen || !student || !token) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/attendance/student/${student.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const rawData: RawAttendance[] = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.attendances)
          ? res.data.attendances
          : [];

        const normalized: Attendance[] = rawData
          .map((r) => ({
            id: r.id,
            studentId: r.studentId,
            status: normalizeStatusFromBackend(r.status),
            date: r.date,
            notes: r.notes ?? r.note ?? null,
            createdAt: r.createdAt ?? r.created_at,
          }))
          .filter((x: Attendance) => Boolean(x.date));

        if (!cancelled) setAttendances(normalized);
      } catch (err) {
        console.error("Gagal fetch:", err);
        if (!cancelled) setAttendances([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [isOpen, student, token, API_URL]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ========================================
  // 🔧 REVISI 1: CREATE / UPDATE FUNCTION
  // ========================================
  const handleAddOrUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token || !student) return;

    setSaving(true);
    try {
      // 🔧 FIX: Backend expect field "student" bukan "studentId"
      // 🔧 FIX: Convert date ke ISO string
      const payload = {
        student: student.id,  // ← CHANGED: dari studentId ke student
        status: convertStatusToBackend(form.status),
        date: new Date(form.date).toISOString(), // ← ADDED: toISOString()
        notes: form.notes || null,
      };

      console.log('📤 Payload being sent:', payload); // ← DEBUG

      if (editingId) {
        // UPDATE: backend tidak perlu field "student" saat update
        await axios.put(`${API_URL}/attendance/${editingId}`, {
          status: payload.status,
          date: payload.date,
          notes: payload.notes
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // CREATE: gunakan payload dengan field "student"
        await axios.post(`${API_URL}/attendance/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSaved?.();
      setEditingId(null);
      setForm({
        status: "hadir",
        date: new Date().toISOString().slice(0, 10),
        notes: "",
      });

      // Reload data
      const res = await axios.get(
        `${API_URL}/attendance/student/${student.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rawData: RawAttendance[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.attendances)
        ? res.data.attendances
        : [];

      const normalized: Attendance[] = rawData
        .map((r) => ({
          id: r.id,
          studentId: r.studentId,
          status: normalizeStatusFromBackend(r.status),
          date: r.date,
          notes: r.notes ?? r.note ?? null,
          createdAt: r.createdAt ?? r.created_at,
        }))
        .filter((x: Attendance) => Boolean(x.date));

      setAttendances(normalized);
    } catch (err: any) {
      console.error("❌ Gagal simpan:", err);
      console.error("❌ Error response:", err.response?.data); // ← DEBUG
      
      // 🔧 IMPROVED: Tampilkan pesan error yang lebih detail
      const errorMsg = err.response?.data?.message || "Gagal menyimpan kehadiran.";
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };
  // ========================================
  // 🔧 END REVISI 1
  // ========================================

  const handleStartEdit = (a: Attendance) => {
    setEditingId(a.id);
    setForm({
      status: a.status,
      date: a.date.slice(0, 10),
      notes: a.notes ?? "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      status: "hadir",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
  };

  const handleAskDelete = (a: Attendance) => {
    setAttendanceToDelete(a);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!token || !attendanceToDelete) return;

    try {
      await axios.delete(`${API_URL}/attendance/${attendanceToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowDeleteConfirm(false);
      setAttendanceToDelete(null);

      // Reload data
      const res = await axios.get(
        `${API_URL}/attendance/student/${attendanceToDelete.studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rawData: RawAttendance[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.attendances)
        ? res.data.attendances
        : [];

      const normalized: Attendance[] = rawData
        .map((r) => ({
          id: r.id,
          studentId: r.studentId,
          status: normalizeStatusFromBackend(r.status),
          date: r.date,
          notes: r.notes ?? r.note ?? null,
          createdAt: r.createdAt ?? r.created_at,
        }))
        .filter((x: Attendance) => Boolean(x.date));

      setAttendances(normalized);
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("Gagal menghapus kehadiran.");
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-3xl mx-4 shadow-lg">
        {/* HEADER */}
        <div className="p-4 border-b flex rounded-t-2xl justify-between items-center"
        style={{ backgroundColor: accentColor }}>
          <h3 className="text-lg font-semibold" style={{color: textColor}}>Kehadiran — {student.name}</h3>
          <button onClick={onClose}>
            <MdOutlineClose className="w-6 h-6 hover:opacity-80 cursor-pointer" style={{color: textColor}} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-auto">
          <form
            onSubmit={handleAddOrUpdate}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="text-sm text-gray-600">Tanggal</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value.toLowerCase()}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Catatan</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Contoh: terlambat 10 menit"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2">
              {editingId ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-2 border text-md rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-3 py-2 bg-[#f5bb00] text-md hover:opacity-80 rounded-lg cursor-pointer"
                    style={{backgroundColor: accentColor, color: textColor}}
                  >
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-2 text-bold text-md rounded-lg hover:opacity-80 cursor-pointer"
                  style={{backgroundColor: accentColor, color: textColor}}>
                  {saving ? "Menyimpan..." : "Tambah Kehadiran"}
                </button>
              )}
            </div>
          </form>

          {/* TABLE */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Riwayat Kehadiran</h4>

            {loading ? (
              <div className="text-center text-gray-500 py-6">
                Memuat data...
              </div>
            ) : attendances.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                Belum ada data kehadiran.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="py-2 px-3">Tanggal</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Catatan</th>
                    <th className="py-2 px-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances
                    .slice()
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .map((a) => (
                      <tr key={a.id} className="border-t">
                        <td className="py-2 px-3">{formatDate(a.date)}</td>
                        <td className="py-2 px-3 capitalize">{a.status}</td>
                        <td className="py-2 px-3">{a.notes || "-"}</td>
                        <td className="py-2 px-3 flex gap-2">
                          <button
                            onClick={() => handleStartEdit(a)}
                            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                          >
                            <MdEdit className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleAskDelete(a)}
                            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                          >
                            <MdDelete className="w-5 h-5 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && attendanceToDelete && (
        <DeleteConfirmation
          deleted={`kehadiran tanggal ${formatDate(attendanceToDelete.date)}`}
          open={showDeleteConfirm}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setAttendanceToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}