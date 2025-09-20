import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const onLogin = () => navigate("/login");
  const onSignup = () => navigate("/register");
  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col justify-center items-center text-center px-6">
      {/* Optional: background pattern or shape */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-orange-300 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-yellow-300 opacity-20 animate-pulse"></div>
      </div>

      <section className="relative z-10 space-y-6 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-orange-600 font-secondary">
          Welcome to ChatApp
        </h1>
        <p className="text-neutral-600 text-lg md:text-xl font-mono tracking-tight">
          Connect with friends, share moments, and discover new conversations.
          ChatApp makes it easy to stay connected anytime, anywhere.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            onClick={onLogin}
            className="px-8 py-3 bg-white text-neutral-700 hover:bg-white font-mono font-bold"
          >
            Login
          </Button>
          <Button
            onClick={onSignup}
            className="px-8 py-3 bg-orange-500 text-white font-mono font-bold"
          >
            Get Started
          </Button>
        </div>

        {/* Additional content */}
        <div className="mt-12 space-y-4 text-neutral-700 font-mono tracking-tighter text-center">
          <h2 className="text-2xl font-bold">Why ChatApp?</h2>
          <span>Instant messaging with friends and family</span> <br />
          <span>Create groups and share moments together</span> <br />
          <span>Secure and private conversations</span> <br />
          <span>Discover new people and communities</span>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
