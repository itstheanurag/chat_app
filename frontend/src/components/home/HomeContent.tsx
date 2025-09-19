import Button from "../ui/Button";
import HeroSection from "./HeroSection";
import MainCard from "./MainCard";

export default function HomeContent({
  onLogin,
  onSignup,
}: {
  onLogin: () => void;
  onSignup: () => void;
}) {
  return (
    <main className="space-y-16">
      <HeroSection onLogin={onLogin} onSignup={onSignup} />
      
      <div className="mx-auto max-w-6xl space-y-16 px-4">
        {/* Main Card */}
        <MainCard />

        {/* How It Works Section */}
        <section className="space-y-8 text-center">
          <h2 className="text-3xl font-extrabold font-mono tracking-tighter">
            How it works
          </h2>
          <p className="text-neutral-600 text-md font-mono tracking-tighter">
            Sign up, find your friends, start chatting, and enjoy real-time
            conversations anywhere.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border-4 shadow-background transition">
              <h3 className="text-xl font-bold mb-2">Real-time Chat</h3>
              <p className="text-neutral-600">
                Send and receive messages instantly with your friends.
              </p>
            </div>
            <div className="p-6 border-4 shadow-background">
              <h3 className="text-xl font-bold mb-2">Discover People</h3>
              <p className="text-neutral-600">
                Meet new people who share your interests and hobbies.
              </p>
            </div>
            <div className="p-6 border-4 shadow-background">
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-neutral-600">
                Your messages are encrypted and private, only visible to you and
                your friends.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold font-mono tracking-tighter">
            Ready to start?
          </h2>
          <p className="text-neutral-600 text-md font-mono tracking-tighter">
            Join ChatApp today and start connecting with your friends!
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Button
              onClick={onLogin}
              className="px-6 py-2 bg-white text-neutral-700 font-mono font-bold"
            >
              Login
            </Button>
            <Button
              onClick={onSignup}
              className="px-6 py-2 bg-orange-500 text-white font-mono font-bold"
            >
              Sign Up
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
