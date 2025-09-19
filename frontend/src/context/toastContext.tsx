import React, { createContext, useContext, type ReactNode } from "react";
import { toast, type ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    options?: ToastOptions
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const showToast = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions
  ) => {
    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warn(message, options);
        break;
      default:
        toast.info(message, options);
        break;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
