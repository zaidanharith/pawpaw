import React from "react";
import { useSession } from "next-auth/react";

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

interface DashboardTitleProps {
    page?: string;
}

const DashboardPageTitle: React.FC<DashboardTitleProps> = ({ page }) => {
    const { data: session } = useSession();
    const role = (session?.user?.role as UserRole) || "ADMIN";
    const textColor = textColors[role] || textColors.ADMIN;
    const accentColor = roleColors[role] || roleColors.ADMIN;

    return (
        <div
            className="w-full px-5 py-3 rounded-xl shadow"
            style={{ backgroundColor: accentColor, color: textColor }}
        >
            <h1 className="font-bold text-xl">
                {page} 
            </h1>
        </div>
    );
};

export default DashboardPageTitle;