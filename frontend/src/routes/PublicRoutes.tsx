import { Route } from "react-router-dom";
import { PublicLayout, VerifyEmailRoute } from "./Guards";
import Home from "@/components/home/Home";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { VerifyEmailForm } from "@/components/auth/VerifyEmail";

export const PublicRoutes = (
  <>
    <Route
      path="/"
      element={
        <PublicLayout>
          <Home />
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
    <Route
      path="/verify-email"
      element={
        <PublicLayout>
          <VerifyEmailRoute>
            <VerifyEmailForm />
          </VerifyEmailRoute>
        </PublicLayout>
      }
    />
  </>
);
