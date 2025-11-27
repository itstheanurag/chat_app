import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores";

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData.email, formData.password, formData.name);
    navigate("/verify-email");
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-violet-50 py-12 px-4">
      <div className="w-full max-w-md bg-white border-4 border-gray-900 shadow-background relative">
        {/* Decorative Elements */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-pink-500 border-2 border-gray-900 z-10"></div>
        <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-violet-500 border-2 border-gray-900 z-10"></div>

        {/* Header */}
        <div className="border-b-4 border-gray-900 p-6 bg-violet-500">
          <h1 className="text-3xl font-bold text-white font-tertiary uppercase tracking-wider drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]">
            Create Account
          </h1>
          <p className="text-violet-100 font-mono text-sm mt-2">
            Join us and start chatting today.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 font-mono uppercase">
                Name
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 rounded-none group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 bg-white text-gray-900 font-mono focus:outline-none focus:bg-violet-50 transition-colors relative z-10"
                    placeholder="Choose a name"
                    required
                  />
                </div>
              </div>
            </div>

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
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
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
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-900 bg-white text-gray-900 font-mono focus:outline-none focus:bg-violet-50 transition-colors relative z-10"
                    placeholder="Create a password"
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
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-gray-600 font-mono text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-violet-600 font-bold hover:underline decoration-2 underline-offset-2"
                >
                  LOGIN HERE
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
