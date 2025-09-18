import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/authContext";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-4 border-gray-900 shadow-lg">
      {/* Header */}
      <div className="bg-orange-100 border-b-4 border-gray-900 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-700 mt-2">
          Sign in to continue your conversations
        </p>
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

          {/* Forgot Password */}
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-orange-500 hover:text-orange-700 font-medium transition-colors"
          >
            Forgot your password?
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-gray-100 font-bold py-4 border-2 border-gray-900 transition-all duration-200 hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <p className="text-center text-gray-700">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-orange-500 hover:text-orange-700 font-bold underline transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
