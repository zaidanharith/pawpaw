import React from 'react';

type RoleLabelProps = {
    role: string;
};

const roleColors: Record<string, string> = {
    ADMIN: "#3f9065",
    TEACHER: "#f5bb00",
    PARENT: "#58baab",
};


const RoleLabel: React.FC<RoleLabelProps> = ({role}) => {

    const accentColor = roleColors[role];
    const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

    return (
        <span
            className="inline-flex items-center text-center px-2 py-0.5 rounded-lg text-xs first-letter:uppercase w-auto whitespace-nowrap flex-shrink-0"
            style={{
                backgroundColor: accentColor,
                color: textColor,
                width: "auto",
                minWidth: 0,
            }}
        >
            {(role === "PARENT" ? "Orang Tua" : (role === "TEACHER") ? "Guru" : "Admin")}
        </span>
    );
};

export default RoleLabel;