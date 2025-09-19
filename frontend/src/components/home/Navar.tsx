import Button from "../ui/Button";

interface NavbarProps {
  onHome?: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHome, onLogin, onSignup }) => {
  return (
    <nav className="w-full bg-neutral-50/70 backdrop-blur-md shadow px-6 py-3 flex justify-between items-center sticky top-0 z-50"> 
      <div
        onClick={onHome}
        className="text-xl px-3 py-1 font-bold font-mono text-white bg-orange-500 border-2 border-gray-800 shadow-background"
      >
        ChatApp
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={onLogin}
          className="bg-white text-neutral-700 font-mono hover:bg-white hover:translate-x-0 hover:translate-y-0 transition-none px-4 py-2 font-bold"
        >
          Login
        </Button>

        <Button
          onClick={onSignup}
          className="bg-orange-500 px-4 py-2 font-mono text-neutral-50 font-bold"
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
