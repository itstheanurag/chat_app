import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Shield } from "lucide-react";
import Button from "../ui/Button";
import HeroSection from "./HeroSection";
import MainCard from "./MainCard";
import Stats from "./Stats";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";

export default function HomeContent() {
  const navigate = useNavigate();
  const onLogin = () => navigate("/login");
  const onSignup = () => navigate("/register");

  return (
    <main className="bg-white">
      <HeroSection />

      {/* Stats Section */}
      <Stats />

      <div className="space-y-0">
        {/* Trusted By Section */}
        <section className="py-12 border-b-4 border-gray-900 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center font-bold text-gray-500 mb-8 uppercase tracking-widest text-sm font-mono">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-2xl font-black font-tertiary text-gray-900">
                ACME_CORP
              </span>
              <span className="text-2xl font-black font-tertiary text-gray-900">
                TECH_GIANT
              </span>
              <span className="text-2xl font-black font-tertiary text-gray-900">
                STARTUP_INC
              </span>
              <span className="text-2xl font-black font-tertiary text-gray-900">
                GLOBAL_LTD
              </span>
            </div>
          </div>
        </section>

        {/* Main Card Section */}
        <section className="py-24 px-4">
          <MainCard />
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-violet-50 px-4 border-y-4 border-gray-900">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-tertiary text-gray-900 uppercase tracking-wider">
                How it works
              </h2>
              <p className="text-gray-900 text-lg font-mono font-bold">
                Sign up, find your friends, start chatting, and enjoy real-time
                conversations anywhere. It's that simple.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 border-4 border-gray-900 shadow-background hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                <div className="w-12 h-12 bg-blue-400 border-2 border-gray-900 rounded-none mb-6 flex items-center justify-center text-gray-900 shadow-button">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-mono text-gray-900 uppercase">
                  Real-time Chat
                </h3>
                <p className="text-gray-800 font-mono leading-relaxed font-medium">
                  Send and receive messages instantly with your friends. No
                  delays, just speed.
                </p>
              </div>
              <div className="bg-white p-8 border-4 border-gray-900 shadow-background hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                <div className="w-12 h-12 bg-green-400 border-2 border-gray-900 rounded-none mb-6 flex items-center justify-center text-gray-900 shadow-button">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-mono text-gray-900 uppercase">
                  Discover People
                </h3>
                <p className="text-gray-800 font-mono leading-relaxed font-medium">
                  Meet new people who share your interests and hobbies. Expand
                  your circle.
                </p>
              </div>
              <div className="bg-white p-8 border-4 border-gray-900 shadow-background hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                <div className="w-12 h-12 bg-purple-400 border-2 border-gray-900 rounded-none mb-6 flex items-center justify-center text-gray-900 shadow-button">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-mono text-gray-900 uppercase">
                  Secure & Private
                </h3>
                <p className="text-gray-800 font-mono leading-relaxed font-medium">
                  Your messages are encrypted and private. Only you and your
                  friends can read them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ */}
        <FAQ />

        {/* Call to Action */}
        <section className="py-24 px-4 bg-violet-500 border-t-4 border-gray-900">
          <div className="max-w-5xl mx-auto text-center relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold font-tertiary text-white drop-shadow-[4px_4px_0px_rgba(15,23,42,1)]">
                READY TO START CHATTING?
              </h2>
              <p className="text-white text-xl font-mono font-bold max-w-2xl mx-auto drop-shadow-md">
                Join thousands of users today and experience the best way to
                connect with friends.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
                <Button
                  onClick={onSignup}
                  className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-bold font-mono text-lg border-4 border-gray-900 shadow-background hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  CREATE FREE ACCOUNT
                </Button>
                <Button
                  onClick={onLogin}
                  className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 font-bold font-mono text-lg border-4 border-white shadow-background hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  LOGIN TO ACCOUNT
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
