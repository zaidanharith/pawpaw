import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    const baseStyles =
      "font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
      secondary:
        "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
      success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
      outline:
        "bg-transparent border-2 border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizeStyles = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const finalClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`;

    return (
      <button ref={ref} className={finalClassName} {...props}>
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

// White Manage Button - untuk Kelola Siswa, Guru, Admin
export const YellowManageButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
  >
    {label}
  </button>
);

// Green Manage Button - untuk Kelola Live Report, Pengumuman
export const GreenManageButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
  >
    {label}
  </button>
);

// Green View More Button - untuk Lihat Selengkapnya
export const ViewMoreButton = ({
  label,
  onClick,
  bgColor = "#2E6F4D",
  hoverColor = "#245839",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    {label}
  </button>
);

// Green Pill Button - untuk Admin, Guru, Orang Tua
export const GreenPillButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
  >
    {label}
  </button>
);

// White Pill Button - untuk Admin (inactive/outline)
export const WhitePillButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300"
  >
    {label}
  </button>
);

// Add User Button - dengan icon plus
export const AddUserButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
  >
    <span className="text-lg">+</span>
    {label}
  </button>
);

// Cancel/Batal Button - dengan border outline
export const CancelButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg border-2 border-green-600"
    style={{ borderColor: "#2E6F4D" }}
  >
    {label}
  </button>
);

// Reset Password Button
export const ResetPasswordButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
  >
    {label}
  </button>
);

// Create Announcement Button - dengan icon plus
export const CreateAnnouncementButton = ({
  label,
  onClick,
  bgColor = "#2E6F4D",
  hoverColor = "#245839",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 justify-center w-full"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    <span className="text-xl">+</span>
    {label}
  </button>
);

// Filter Pill Button - untuk Semua, Hari ini
export const FilterPillButton = ({
  label,
  isActive = false,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
      isActive
        ? "text-white shadow-md hover:shadow-lg"
        : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
    }`}
    style={
      isActive
        ? { backgroundColor: "#2E6F4D" }
        : {}
    }
    onMouseEnter={(e) => {
      if (isActive) {
        e.currentTarget.style.backgroundColor = "#245839";
      }
    }}
    onMouseLeave={(e) => {
      if (isActive) {
        e.currentTarget.style.backgroundColor = "#2E6F4D";
      }
    }}
  >
    {label}
  </button>
);

// View Detail Button
export const ViewDetailButton = ({
  label,
  onClick,
  bgColor = "#2E6F4D",
  hoverColor = "#245839",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    {label}
  </button>
);

// Upload Announcement Button
export const UploadAnnouncementButton = ({
  label,
  onClick,
  bgColor = "#2E6F4D",
  hoverColor = "#245839",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    {label}
  </button>
);

// Save Button
export const SaveButton = ({
  label,
  onClick,
  bgColor = "#2E6F4D",
  hoverColor = "#245839",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    {label}
  </button>
);

// Edit Button - dengan icon pensil
export const EditButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
  >
    <span>✏️</span>
    {label}
  </button>
);

// Detail Button - dengan icon info
export const DetailButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
    style={{ backgroundColor: "#FFA500" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FF8C00")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFA500")}
  >
    <span>ℹ️</span>
    {label}
  </button>
);

// Delete Button - dengan icon hapus
export const DeleteButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
    style={{ backgroundColor: "#DC2626" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#991B1B")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#DC2626")}
  >
    <span>🗑️</span>
    {label}
  </button>
);

// Create Report Button - dengan icon plus
export const CreateReportButton = ({
  label,
  onClick,
  bgColor = "#2E6F4D",
  hoverColor = "#245839",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 justify-center w-full"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    <span className="text-xl">+</span>
    {label}
  </button>
);

// View Detail Report Button
export const ViewDetailReportButton = ({
  label,
  onClick,
  bgColor = "#2E6F4D",
  hoverColor = "#245839",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    {label}
  </button>
);

// Upload Report Button
export const UploadReportButton = ({
  label,
  onClick,
  bgColor = "#2E6F4D",
  hoverColor = "#245839",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    {label}
  </button>
);

// View Class Detail Button - untuk Lihat Detail Kelas
export const ViewClassDetailButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-gray-800 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg w-full"
    style={{ backgroundColor: "#FDE047" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FBBF24")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FDE047")}
  >
    {label}
  </button>
);

// Class Info Button - untuk Info Kelas
export const ClassInfoButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-gray-800 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg border-2"
    style={{ borderColor: "#FDE047", backgroundColor: "transparent" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFFBEB")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
  >
    <span className="mr-2">➜</span>
    {label}
  </button>
);

// Tab Button - untuk Info Kelas, Daftar Siswa, Kehadiran Siswa
export const TabButton = ({
  label,
  isActive = false,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-semibold text-sm transition-all duration-200 ${
      isActive
        ? "text-gray-800 border-b-2"
        : "text-gray-600 border-b-2 border-transparent"
    }`}
    style={
      isActive
        ? { borderColor: "#FDE047" }
        : {}
    }
  >
    {label}
  </button>
);

// Attendance Status Radio Button - untuk Hadir, Sakit, Izin, Alfa
export const AttendanceRadioButton = ({
  label,
  isSelected = false,
  onClick,
}: {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 border-2 ${
      isSelected
        ? "text-gray-800"
        : "text-gray-600 border-gray-300 bg-white"
    }`}
    style={
      isSelected
        ? { backgroundColor: "#FDE047", borderColor: "#FDE047" }
        : {}
    }
  >
    {label}
  </button>
);

// Logout/Keluar Button
export const LogoutButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: "#DC2626" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#991B1B")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#DC2626")}
  >
    {label}
  </button>
);

// Tab Filter Button - untuk Semua, Belum Dibaca
export const TabFilterButton = ({
  label,
  isActive = false,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 font-semibold text-sm transition-all duration-200 ${
      isActive
        ? "text-gray-800 bg-white border-b-2"
        : "text-gray-600 bg-gray-100 border-b-2 border-transparent"
    }`}
    style={
      isActive
        ? { borderColor: "#FDE047" }
        : {}
    }
  >
    {label}
  </button>
);

// Reply Button - untuk Balas
export const ReplyButton = ({
  label,
  onClick,
  bgColor = "#FDE047",
  hoverColor = "#FBBF24",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg w-full"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    {label}
  </button>
);

// Send Message Button - untuk Kirim Pesan
export const SendMessageButton = ({
  label,
  onClick,
  bgColor = "#58BAAB",
  hoverColor = "#4A9A94",
}: {
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    <span>✈️</span>
    {label}
  </button>
);

// Send Message Icon Button - untuk Kirim Pesan dengan icon saja
export const SendMessageIconButton = ({
  onClick,
  bgColor = "#58BAAB",
  hoverColor = "#4A9A94",
}: {
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    className="text-white p-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
    style={{ backgroundColor: bgColor }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
  >
    <span className="text-lg">✈️</span>
  </button>
);
