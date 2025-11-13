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