import React, { useState } from "react";
import { Mail } from "lucide-react";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/lib/storage";
import { useAuthStore } from "@/stores";

export const VerifyEmailForm: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const { verifyEmail, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const token = getToken("emailVerificationToken");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await verifyEmail(token, verificationCode);
    navigate("/login", { replace: true });
  };

  return (
    <div className="mt-24 w-full max-w-md mx-auto bg-white border-4 border-neutral-900 shadow-background">
      <div className="bg-navy-100 border-b-4 border-slate-900 p-6 flex items-center justify-center gap-2">
        <Mail className="h-8 w-8 text-navy-600" />{" "}
        <p className="text-slate-600">
          We sent a verification code to your email
        </p>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <p className="text-slate-600">
            Enter the 6-digit code we sent to your email address
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setVerificationCode(val);
                }
              }}
              className="w-full px-6 py-4 text-center text-2xl font-mono border-3 border-slate-300 focus:border-navy-500 focus:outline-none transition-colors bg-white text-slate-900 tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
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
