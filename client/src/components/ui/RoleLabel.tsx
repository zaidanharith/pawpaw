import React from 'react';
import { useSession } from "next-auth/react";

type RoleLabelProps = {
    role: string;
};

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};


const RoleLabel: React.FC<RoleLabelProps> = () => {
    const { data: session } = useSession();
    const role = session?.user?.role || "ADMIN";

    const accentColor = roleColors[role];
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

    return (
        <span className={`flex items-center text-center px-1.5 py-0.75 rounded-lg text-xs first-letter:uppercase `}
        style={{
                backgroundColor: accentColor,
                color: textColor,
            }}>
            {role.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
        </span>
    );
};

export default RoleLabel;