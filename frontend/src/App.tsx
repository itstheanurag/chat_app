import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth, AuthProvider } from "@/context/authContext";
import { ChatLayout } from "@/components/layout/ChatLayout";
import Home from "@/components/home/Home";
import { VerifyEmailForm } from "@/components/auth/VerifyEmail";
import Navbar from "@/components/home/Navar";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginForm } from "@/components/auth/LoginForm";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <Navbar />
    {children}
  </>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" />;
  if (user && !user.isEmailVerified) return <Navigate to="/verify-email" />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route
        path="/verify-email"
        element={
          <PublicLayout>
            <VerifyEmailForm />
          </PublicLayout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginForm />
          </PublicLayout>
        }
      />

      <Route
        path="/register"
        element={
          <PublicLayout>
            <RegisterForm />
          </PublicLayout>
        }
      />

      {/* Protected route */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
