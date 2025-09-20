import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/authContext";

interface VerifyEmailFormProps {
  onBackToLogin: () => void;
}

export const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  onBackToLogin,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const { verifyEmail, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyEmail(verificationCode);
    onBackToLogin();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-4 border-slate-900 shadow-lg">
      <div className="bg-navy-100 border-b-4 border-slate-900 p-6">
        <button
          onClick={onBackToLogin}
          className="flex items-center text-navy-600 hover:text-navy-800 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Verify Your Email</h1>
        <p className="text-slate-600 mt-2">
          We sent a verification code to your email
        </p>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-navy-100 border-3 border-slate-900 mb-4">
            <Mail className="h-8 w-8 text-navy-600" />
          </div>
          <p className="text-slate-600">
            Enter the 6-digit code we sent to your email address
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-6 py-4 text-center text-2xl font-mono border-3 border-slate-300 focus:border-navy-500 focus:outline-none transition-colors bg-white text-slate-900 tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full bg-navy-500 hover:bg-navy-600 disabled:bg-slate-300 text-white font-bold py-4 border-3 border-slate-900 transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-3 border-slate-200 text-center">
          <p className="text-slate-600 mb-4">Didn't receive the code?</p>
          <button className="text-navy-600 hover:text-navy-800 font-bold underline transition-colors">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};
