import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/authContext";
import Button from "../ui/Button";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-4 border-gray-900 shadow-background">
      {/* Header */}
      <div className="border-b-4 border-neutral-800 p-4">
        <h1 className="text-2xl font-bold text-neutral-900">Login</h1>
      </div>

      {/* Form */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 focus:border-orange-400 focus:outline-none transition-colors bg-white text-gray-900"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 focus:border-orange-400 focus:outline-none transition-colors bg-white text-gray-900"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
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
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-mono text-neutral-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};
