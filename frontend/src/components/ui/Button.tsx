import { cn } from "@/utils/cn";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  type = "button",
  disabled,
  children,
  className = "",
  ...props
}) => {

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn("bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-gray-100 py-2 border-2 border-gray-900 transition-all duration-200 hover:translate-x-1 hover:translate-y-1 shadow-button font-mono font-bold", className)}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
