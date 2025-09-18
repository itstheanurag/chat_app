import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/authContext";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onEmailSent: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onEmailSent,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await register(formData.email, formData.password, formData.username);
    onEmailSent();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-4 border-slate-900 shadow-lg">
      <div className="bg-coral-100 border-b-4 border-slate-900 p-6">
        <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
        <p className="text-slate-600 mt-2">Join the conversation today</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => updateFormData("username", e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-3 border-slate-300 focus:border-coral-500 focus:outline-none transition-colors bg-white text-slate-900"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateFormData("confirmPassword", e.target.value)
                }
                className="w-full pl-12 pr-12 py-4 border-3 border-slate-300 focus:border-coral-500 focus:outline-none transition-colors bg-white text-slate-900"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sage-500 hover:bg-sage-600 disabled:bg-slate-300 text-white font-bold py-4 border-3 border-slate-900 transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-3 border-slate-200">
          <p className="text-center text-slate-600">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-coral-600 hover:text-coral-800 font-bold underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
