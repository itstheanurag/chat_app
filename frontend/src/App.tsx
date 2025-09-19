import React from "react";
import { useAuth, AuthProvider } from "./context/authContext";
import { ChatLayout } from "./components/layout/ChatLayout";
import Home from "./components/home/Home";

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Home />;
  }

  return <ChatLayout currentUser={user} />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
