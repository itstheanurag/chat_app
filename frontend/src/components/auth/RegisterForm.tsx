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
    <div className="w-full mt-28 max-w-md mx-auto bg-white border-4 border-slate-900 shadow-background">
      <div className="border-b-4 border-neutral-900 p-4">
        <h1 className="text-2xl font-bold text-neutral-900">Create Account</h1>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-3 border-slate-300 focus:border-coral-500 focus:outline-none transition-colors bg-white text-slate-900"
                placeholder="Choose a name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-3 border-slate-300 focus:border-coral-500 focus:outline-none transition-colors bg-white text-slate-900"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-3 border-slate-300 focus:border-coral-500 focus:outline-none transition-colors bg-white text-slate-900"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};
