import { useState } from "react";
import { LoginForm } from "../auth/LoginForm";
import { RegisterForm } from "../auth/RegisterForm";
import Navbar from "./Navar";
import HomeContent from "./HomeContent";
import Footer from "./Footer";

const Home = () => {
  const [view, setView] = useState<"home" | "login" | "signup">("home");

  return (
    <>
      <Navbar
        onHome={() => setView("home")}
        onLogin={() => setView("login")}
        onSignup={() => setView("signup")}
      />

      {/* Add top padding so sticky navbar doesn't cover content */}
      <main className="max-w-full mx-auto px-4 pt-20">
        {view === "home" && (
          <HomeContent
            onLogin={() => setView("login")}
            onSignup={() => setView("signup")}
          />
        )}
      </main>

      {view === "login" && <LoginForm />}
      {view === "signup" && <RegisterForm />}

      {view === "home" && <Footer />}
    </>
  );
};

export default Home;
