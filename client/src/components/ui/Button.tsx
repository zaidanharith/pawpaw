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
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
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
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 justify-center w-full"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
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

// Upload Announcement Button
export const UploadAnnouncementButton = ({
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

// Save Button
export const SaveButton = ({
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
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 justify-center w-full"
    style={{ backgroundColor: "#2E6F4D" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#245839")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E6F4D")}
  >
    <span className="text-xl">+</span>
    {label}
  </button>
);

// View Detail Report Button
export const ViewDetailReportButton = ({
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

// Upload Report Button
export const UploadReportButton = ({
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
