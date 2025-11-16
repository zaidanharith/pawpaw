import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { useSession } from "next-auth/react";

interface NewStudentData {
  name: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;   // yyyy-mm-dd dari <input type="date" />
  address: string;
  classroomId: string;
}

interface Classroom {
  id: string;
  name: string;
}

const GENDER_OPTIONS = [
  { value: "MALE", label: "Laki-Laki" },
  { value: "FEMALE", label: "Perempuan" },
];

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface AddStudentProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewStudentData) => void;
}

const initialForm: NewStudentData = {
  name: "",
  gender: "MALE",
  birthDate: "",
  address: "",
  classroomId: "",
};

const AddStudent: React.FC<AddStudentProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<NewStudentData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const { data: session } = useSession();
  const token = session?.accessToken;

  const role = session?.user?.role || "ADMIN";
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

  // ambil daftar kelas
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (!token || !isOpen) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${API_URL}/classroom`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success && Array.isArray(res.data.data)) {
          setClassrooms(res.data.data);
        } else {
          setClassrooms([]);
        }
      } catch {
        setClassrooms([]);
      }
    };

    fetchClassrooms();
  }, [token, isOpen]);

  // reset form setiap modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.gender ||
      !formData.birthDate ||
      !formData.classroomId
    ) {
      alert("Mohon lengkapi Nama, Jenis Kelamin, Tanggal Lahir, dan Kelas.");
      return;
    }

    if (!token) {
      alert("Token tidak ditemukan, silakan login ulang.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      await axios.post(
        `${API_URL}/student/create`,
        {
          name: formData.name,
          gender: formData.gender,          // MALE | FEMALE
          birthDate: formData.birthDate,    // backend akan new Date(...)
          address: formData.address || null,
          classroomId: formData.classroomId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSave(formData);
      setFormData(initialForm);
      onClose();
    } catch (err) {
      alert("Gagal menambah siswa");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-lg">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Tambah Siswa Baru</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
            title="Close"
            type="button"
          >
            <MdOutlineClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Jenis Kelamin
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Lahir
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Alamat
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="classroomId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kelas
            </label>
            <select
              id="classroomId"
              name="classroomId"
              value={formData.classroomId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#3f9065] focus:outline-none"
            >
              <option value="">-- Pilih Kelas --</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg shadow-md hover:opacity-90 transition"
              style={{ backgroundColor: accentColor, color: textColor }}
            >
              {loading ? "Menyimpan..." : "Simpan Siswa Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
