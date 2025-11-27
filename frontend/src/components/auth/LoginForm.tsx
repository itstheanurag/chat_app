import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat", { replace: true });
    }
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-violet-50 py-12 px-4">
      <div className="w-full max-w-md bg-white border-4 border-gray-900 shadow-background relative">
        {/* Decorative Elements */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-violet-500 border-2 border-gray-900 z-10"></div>
        <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-pink-500 border-2 border-gray-900 z-10"></div>

        {/* Header */}
        <div className="border-b-4 border-gray-900 p-6 bg-violet-500">
          <h1 className="text-3xl font-bold text-white font-tertiary uppercase tracking-wider drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]">
            Welcome Back
          </h1>
          <p className="text-violet-100 font-mono text-sm mt-2">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 font-mono uppercase">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 rounded-none group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 bg-white text-gray-900 font-mono focus:outline-none focus:bg-violet-50 transition-colors relative z-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 font-mono uppercase">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 rounded-none group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-900 bg-white text-gray-900 font-mono focus:outline-none focus:bg-violet-50 transition-colors relative z-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors z-20"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-mono font-bold text-lg bg-violet-500 text-white border-2 border-gray-900 shadow-button hover:bg-violet-600 hover:border-gray-900 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all py-4 mt-4"
            >
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-gray-600 font-mono text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-violet-600 font-bold hover:underline decoration-2 underline-offset-2"
                >
                  CREATE ACCOUNT
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
