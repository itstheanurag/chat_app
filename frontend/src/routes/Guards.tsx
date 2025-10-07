import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "@/lib/storage";
import Navbar from "@/components/home/Navar";
import { useAuthStore } from "@/stores/user.store";

export const VerifyEmailRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthStore();
  const token = getToken("emailVerificationToken");

  if (!user && !token) return <Navigate to="/login" replace />;
  if (user?.isEmailVerified) return <Navigate to="/chat" replace />;
  return <>{children}</>;
};

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isEmailVerified)
    return <Navigate to="/chat" replace />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" />;
  if (!user?.isEmailVerified) return <Navigate to="/verify-email" />;
  return <>{children}</>;
};
