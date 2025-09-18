import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { LoginForm } from "../auth/LoginForm";
import { RegisterForm } from "../auth/RegisterForm";
import { VerifyEmailForm } from "../auth/VerifyEmail";

type AuthView = "login" | "register" | "verify";

export const AuthLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:block">
          <div className="bg-white border-4 border-gray-900 p-12 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-orange-500 flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                <MessageSquare className="h-8 w-8 text-gray-100" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">ChatVintage</h1>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect with Style
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Experience messaging with a modern vintage twist. Clean design
              meets powerful functionality in our beautifully crafted chat
              application.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 border border-gray-900"></div>
                <span className="text-gray-700">
                  Secure end-to-end messaging
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-orange-400 border border-gray-900"></div>
                <span className="text-gray-700">Group conversations</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-blue-500 border border-gray-900"></div>
                <span className="text-gray-700">Read receipt tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full">
          {currentView === "login" && (
            <LoginForm
              onSwitchToRegister={() => setCurrentView("register")}
              onForgotPassword={() => {}}
            />
          )}
          {currentView === "register" && (
            <RegisterForm
              onSwitchToLogin={() => setCurrentView("login")}
              onEmailSent={() => setCurrentView("verify")}
            />
          )}
          {currentView === "verify" && (
            <VerifyEmailForm onBackToLogin={() => setCurrentView("login")} />
          )}
        </div>
      </div>
    </div>
  );
};
