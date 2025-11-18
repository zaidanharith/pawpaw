"use client";

import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaUserPlus, FaClipboardList } from "react-icons/fa";
import { useSession } from "next-auth/react";
import axios from "axios";
import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import DeleteConfirmation from "../DeleteConfirmation";
import AttendanceModal from "./Attendance";

interface Parent {
  id: string;
  name: string;
  email: string;
}

interface Classroom {
  id: string;
  name: string;
}

interface Siswa {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  classroom?: Classroom; // Ubah dari string jadi object Classroom
  classroomId?: string; // Tambahkan ini untuk ID
  address: string;
  parent?: Parent | null;
  attendanceSummary?: {
    hadir: number;
    izin: number;
    sakit: number;
    alfa: number;
  };
}

interface Attendance {
  id: string;
  studentId: string;
  status: "hadir" | "izin" | "sakit" | "absent";
  date: string;
}

const genderColors: Record<string, string> = {
  MALE: "#90caf9",
  FEMALE: "#f48fb1",
};

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

type UserRole = "ADMIN" | "TEACHER" | "PARENT";

const textColors: Record<UserRole, string> = {
    ADMIN: "#ffffff",
    TEACHER: "#3d3006",
    PARENT: "#063d35",
};

export default function StudentTable() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role || "ADMIN";
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = textColors[role] || textColors.ADMIN;

  const [allSiswa, setAllSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState<Parent[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editStudentData, setEditStudentData] = useState<Siswa | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Siswa | null>(null);

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [selectedStudentForAttendance, setSelectedStudentForAttendance] = useState<Siswa | null>(null);

  const isAdminOrTeacher = role === "ADMIN" || role === "TEACHER";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- function to fetch students + attendance
  const fetchStudentsWithAttendance = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const students: Siswa[] = res.data.data || [];

      const attendanceRes = await axios.get(`${API_URL}/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const attendances: Attendance[] = attendanceRes.data.data || [];

      const studentsWithSummary = students.map((s) => {
        const summary = attendances
          .filter((a) => a.studentId === s.id)
          .reduce(
            (acc, curr) => {
              switch (curr.status.toLowerCase()) {
                case "hadir":
                  acc.hadir++;
                  break;
                case "izin":
                  acc.izin++;
                  break;
                case "sakit":
                  acc.sakit++;
                  break;
                case "absent":
                case "alfa":
                  acc.alfa++;
                  break;
              }
              return acc;
            },
            { hadir: 0, izin: 0, sakit: 0, alfa: 0 }
          );
        return { ...s, attendanceSummary: summary };
      });

      setAllSiswa(studentsWithSummary);
    } catch (err) {
      console.error(err);
      setAllSiswa([]);
    }
    setLoading(false);
  };

  useEffect(() => {
      const fetchParents = async () => {
          if (!token) return;

          try {
              const API_URL = process.env.NEXT_PUBLIC_API_URL;
              const res = await axios.get(`${API_URL}/user`, {
                  headers: { Authorization: `Bearer ${token}` },
              });

              const onlyParents = res.data.data.filter(
                  (u: any) => u.role === "PARENT"
              );

              setParents(onlyParents);
          } catch {
              setParents([]);
          }
      };

      fetchParents();
  }, [token]);

  useEffect(() => {
      const fetchClassrooms = async () => {
          if (!token) return;

          try {
              const API_URL = process.env.NEXT_PUBLIC_API_URL;
              const res = await axios.get(`${API_URL}/classroom`, {
                  headers: { Authorization: `Bearer ${token}` },
              });

              if (res.data && res.data.data) {
                  setClassrooms(res.data.data);
              } else {
                  console.error("Unexpected API response format:", res.data);
                  setClassrooms([]);
              }
          } catch (error) {
              console.error("Error fetching classrooms:", error);
              setClassrooms([]);
          }
      };

      fetchClassrooms();
  }, [token]); 

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      await fetchStudentsWithAttendance();
    };
    fetchData();
  }, [token]);

  const refreshStudents = fetchStudentsWithAttendance;

  const handleEditStudent = (siswa: Siswa) => {
    setEditStudentData(siswa);
    setIsEditStudentOpen(true);
  };

  const handleAskDeleteStudent = (siswa: Siswa) => {
    setStudentToDelete(siswa);
    setIsDeleteOpen(true);
  };

  const handleConfirmDeleteStudent = async () => {
    if (!studentToDelete || !token) return;
    try {
      await axios.delete(`${API_URL}/student/${studentToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshStudents();
      setIsDeleteOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openAttendanceModal = (siswa: Siswa) => {
    setSelectedStudentForAttendance(siswa);
    setIsAttendanceOpen(true);
  };

  const closeAttendanceModal = () => {
    setSelectedStudentForAttendance(null);
    setIsAttendanceOpen(false);
  };

  const formatBirthDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <>
      <section className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Daftar Siswa</h2>
          {isAdminOrTeacher && (
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="cursor-pointer px-3 py-2 rounded-lg text-sm md:text-base font-semibold hover:opacity-80 transition"
              style={{ backgroundColor: accentColor, color: textColor }}
              title="Tambah Siswa"
            >
              <FaUserPlus />
            </button>
          )}
        </div>

        <div className="rounded-xl overflow-x-auto">
          <table className="w-full text-sm text-gray-700 rounded-xl">
            <thead style={{ backgroundColor: accentColor, color: textColor }}>
              <tr>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                  Nama Lengkap
                </th>
                <th className="px-4 py-3 text-left font-semibold">Jenis Kelamin</th>
                <th className="px-4 py-3 text-left font-semibold">Tanggal Lahir</th>
                <th className="px-4 py-3 text-left font-semibold">Kelas</th>
                <th className="px-4 py-3 text-left font-semibold">Alamat</th>
                <th className="px-4 py-3 text-left font-semibold">Orang Tua</th>
                <th className="px-4 py-3 text-left font-semibold">Hadir</th>
                <th className="px-4 py-3 text-left font-semibold">Izin</th>
                <th className="px-4 py-3 text-left font-semibold">Sakit</th>
                <th className="px-4 py-3 text-left font-semibold">Alfa</th>
                {isAdminOrTeacher && (
                  <th className="px-4 py-3 text-left font-semibold">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-background">
              {loading ? (
                <tr>
                  <td
                    colSpan={isAdminOrTeacher ? 11 : 10}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Memuat data siswa...
                  </td>
                </tr>
              ) : allSiswa.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdminOrTeacher ? 11 : 10}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Tidak ada data siswa yang tersedia.
                  </td>
                </tr>
              ) : (
                allSiswa.map((siswa) => (
                  <tr
                    key={siswa.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-1.5 font-medium whitespace-nowrap">
                      {siswa.name}
                    </td>
                    <td className="px-4 py-1.5">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium uppercase"
                        style={{
                          backgroundColor:
                            genderColors[siswa.gender.toUpperCase()] ||
                            genderColors.MALE,
                          color: "#282828",
                        }}
                      >
                        {siswa.gender === "MALE" ? "Laki-Laki" : "Perempuan"}
                      </span>
                    </td>
                    <td className="px-4 py-1.5">
                      {siswa.birthDate ? formatBirthDate(siswa.birthDate) : "-"}
                    </td>
                    <td className="px-4 py-1.5">
                      {siswa.classroom ? (
                        <span className="font-medium text-gray-800">
                          {siswa.classroom.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Belum ada</span>
                      )}
                    </td>
                    <td className="px-4 py-1.5 max-w-[200px] truncate">{siswa.address}</td>
                    <td className="px-4 py-1.5">
                      {siswa.parent ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 truncate">{siswa.parent.name}</span>
                          <span className="text-xs text-gray-500">{siswa.parent.email}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Belum ada</span>
                      )}
                    </td>
                    <td className="px-4 py-1.5 text-center">{siswa.attendanceSummary?.hadir || 0}</td>
                    <td className="px-4 py-1.5 text-center">{siswa.attendanceSummary?.izin || 0}</td>
                    <td className="px-4 py-1.5 text-center">{siswa.attendanceSummary?.sakit || 0}</td>
                    <td className="px-4 py-1.5 text-center">{siswa.attendanceSummary?.alfa || 0}</td>
                    {isAdminOrTeacher && (
                      <td className="px-4 py-1.5 flex justify-center sm:justify-start gap-3">
                        <button
                          onClick={() => handleEditStudent(siswa)}
                          className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-blue-500 hover:bg-blue-50"
                          title="Edit Siswa"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openAttendanceModal(siswa)}
                          className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-[#3f9065] hover:bg-green-50"
                          title="Attendance"
                        >
                          <FaClipboardList className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAskDeleteStudent(siswa)}
                          className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-red-500 hover:bg-red-50"
                          title="Delete Siswa"
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isAdminOrTeacher && (
        <>
          <AddStudent
            isOpen={isAddStudentOpen}
            onClose={() => setIsAddStudentOpen(false)}
            classrooms={classrooms}
            parents={parents}
            onSaved={refreshStudents}
          />
          <EditStudent
            isOpen={isEditStudentOpen}
            onClose={() => {
                setIsEditStudentOpen(false);
                setEditStudentData(null);
            }}
            classrooms={classrooms}  
            parents={parents}
            studentData={editStudentData}
            onSaved={refreshStudents}
          />
          <DeleteConfirmation
            deleted={studentToDelete?.name || "siswa ini"}
            open={isDeleteOpen}
            onConfirm={handleConfirmDeleteStudent}
            onCancel={() => {
              setIsDeleteOpen(false);
              setStudentToDelete(null);
            }}
          />
          <AttendanceModal
            isOpen={isAttendanceOpen}
            onClose={closeAttendanceModal}
            student={selectedStudentForAttendance}
            onSaved={refreshStudents}
          />
        </>
      )}
    </>
  );
}