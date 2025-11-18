"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { MdOutlineClose, MdCameraAlt } from "react-icons/md";
import Image from "next/image";

interface SessionUser {
  id: string;
  username: string;
  role: "ADMIN" | "TEACHER" | "PARENT";
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phoneNumber?: string | null;
  picture?: string | null;
}

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose, onSave }) => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const role = session?.user?.role || "ADMIN";
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#3d3006";
  const accentColor = roleColors[role] || roleColors.ADMIN;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    picture: string;
  }>({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    picture: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data profil terbaru dari API saat modal dibuka
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOpen && token) {
        setFetchingData(true);
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = response.data.data || response.data;

          setFormData({
            name: userData.name || "",
            username: userData.username || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            picture: userData.picture || "",
          });
          setPreviewImage(userData.picture || "");
        } catch (error) {
          console.error("Error fetching profile:", error);
          // Fallback ke data session jika fetch gagal
          if (session?.user) {
            setFormData({
              name: session.user.name || "",
              username: session.user.username || "",
              email: session.user.email || "",
              phoneNumber: (session.user as any).phoneNumber || "",
              picture: (session.user as any).picture || "",
            });
            setPreviewImage((session.user as any).picture || "");
          }
        } finally {
          setFetchingData(false);
        }
      }
    };

    fetchProfileData();
  }, [isOpen, token, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi file
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setMessage("Format file harus JPG, JPEG, PNG, atau GIF");
        return;
      }

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Ukuran file maksimal 5MB");
        return;
      }

      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setMessage("");
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploadingImage(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      const uploadResponse = await axios.post(
        `${API_URL}/upload`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Asumsikan response berisi URL cloudinary atau path file
      const uploadedUrl = uploadResponse.data?.data?.path || uploadResponse.data?.data?.url;
      return uploadedUrl;
    } catch (error: any) {
      console.error("Upload image error:", error);
      throw new Error(error?.response?.data?.message || "Gagal mengupload gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Token tidak ditemukan. Coba login ulang.");
      return;
    }

    if (!formData.name || !formData.username || !formData.email) {
      alert("Mohon lengkapi semua field wajib (Nama, Username, Email).");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      let pictureUrl = formData.picture;

      // Upload gambar jika ada file baru
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          pictureUrl = uploadedUrl;
        }
      }

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        {
          ...formData,
          picture: pictureUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully");
      onSave();
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error: any) {
      console.error("EDIT PROFILE ERROR:", error?.response || error);
      setMessage(error?.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* CARD: MAX HEIGHT + SCROLL DI DALAM */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div
          className="p-6 border-b border-gray-100 flex justify-between items-center"
          style={{ backgroundColor: accentColor }}
        >
          <h2 className="text-xl font-bold" style={{ color: textColor }}>
            Edit Profil
          </h2>
          <button
            onClick={onClose}
            className="hover:opacity-80 transition"
            style={{ color: textColor }}
            title="Close"
            type="button"
          >
            <MdOutlineClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* BODY FORM: SCROLLABLE */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* FOTO PROFIL */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full border-4 overflow-hidden cursor-pointer hover:opacity-80 transition"
                style={{ borderColor: accentColor }}
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile Preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <MdCameraAlt className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg hover:opacity-90 transition"
                style={{ backgroundColor: accentColor }}
              >
                <MdCameraAlt className="w-5 h-5" style={{ color: textColor }} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              Klik untuk mengubah foto (Max 5MB, JPG/PNG/GIF)
            </p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Contoh: 08123456789"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:outline-none"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium cursor-pointer rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
              disabled={loading || uploadingImage}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg shadow-md hover:opacity-80 transition disabled:opacity-50"
              style={{ backgroundColor: accentColor, color: textColor }}
            >
              {uploadingImage
                ? "Mengupload..."
                : loading
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;