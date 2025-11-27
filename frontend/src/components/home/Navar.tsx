import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();

  const onHome = () => navigate("/");
  const onLogin = () => navigate("/login");
  const onSignup = () => navigate("/register");

  return (
    <nav className="w-full bg-neutral-50/70 backdrop-blur-md shadow px-6 py-3 flex justify-between items-center sticky top-0 z-50 border-b-4 border-gray-900">
      <div
        onClick={onHome}
        className="text-xl px-3 py-1 font-bold font-mono text-white bg-violet-500 border-2 border-gray-900 shadow-background cursor-pointer"
      >
        ChatApp
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={onLogin}
          className="bg-white text-neutral-700 font-mono hover:bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all px-4 py-2 font-bold border-2 border-gray-900 shadow-button"
        >
          Login
        </Button>

        <Button
          onClick={onSignup}
          className="bg-violet-500 px-4 py-2 font-mono text-neutral-50 font-bold border-2 border-gray-900 shadow-button hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
