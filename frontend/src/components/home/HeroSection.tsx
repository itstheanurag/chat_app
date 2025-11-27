import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";
import Button from "../ui/Button";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const onLogin = () => navigate("/login");
  const onSignup = () => navigate("/register");

  return (
    <section className="relative w-full bg-violet-50 overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 border-b-4 border-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 shadow-button text-gray-900 text-sm font-bold font-mono transform -rotate-2 hover:rotate-0 transition-transform">
              <span className="w-3 h-3 bg-violet-500 border border-gray-900"></span>
              v2.0 IS LIVE
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-tertiary text-white leading-[1.1] drop-shadow-[4px_4px_0px_rgba(15,23,42,1)]">
              CONNECT WITH <br />
              <span className="text-violet-500 drop-shadow-[4px_4px_0px_rgba(15,23,42,1)]">
                STYLE & SPEED
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto lg:mx-0 font-mono leading-relaxed border-l-4 border-violet-500 pl-6 bg-white/50 py-2">
              Experience the next generation of messaging. Secure, fast, and
              unapologetically bold. Join thousands of users today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={onSignup}
                className="px-8 py-4 bg-violet-500 text-white font-mono font-bold text-lg border-2 border-gray-900 shadow-button hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                GET STARTED
              </Button>
              <Button
                onClick={onLogin}
                className="px-8 py-4 bg-white text-gray-900 font-mono font-bold text-lg border-2 border-gray-900 shadow-button hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 justify-center"
              >
                LOGIN <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-gray-800 font-mono font-bold">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">ENCRYPTED</span>
              </div>
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gray-200 border-2 border-gray-900 rounded-full"
                    ></div>
                  ))}
                </div>
                <span className="text-sm pl-2">10K+ USERS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="relative lg:h-[600px] w-full flex items-center justify-center">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 border-4 border-gray-900 shadow-background z-0"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-green-400 border-4 border-gray-900 rounded-full z-0"></div>

            {/* Main Visual Card */}
            <div className="relative w-full max-w-md bg-white border-4 border-gray-900 shadow-background z-10 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-violet-500 px-4 py-3 border-b-4 border-gray-900 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-gray-900 rounded-full"></div>
                  <div className="w-4 h-4 bg-white border-2 border-gray-900 rounded-full"></div>
                </div>
                <div className="text-sm font-mono font-bold text-white">
                  CHAT_APP.EXE
                </div>
              </div>
              <div className="p-6 space-y-6 bg-white">
                {/* Mock Chat Messages */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 border-2 border-gray-900 bg-purple-200 flex items-center justify-center font-mono font-bold">
                    JD
                  </div>
                  <div className="bg-gray-100 border-2 border-gray-900 p-3 text-sm font-mono text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Hey! Have you seen the new update? 🚀
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-10 h-10 border-2 border-gray-900 bg-violet-200 flex items-center justify-center font-mono font-bold">
                    ME
                  </div>
                  <div className="bg-violet-500 border-2 border-gray-900 p-3 text-sm font-mono text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Yeah! The new design is incredible. ✨
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-6 -left-6 bg-white border-4 border-gray-900 p-4 shadow-button flex items-center gap-3 animate-bounce">
                <div className="w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                <span className="text-sm font-mono font-bold">NEW MESSAGE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
