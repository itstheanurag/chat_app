import React from "react";
import { useAuth, AuthProvider } from "./context/authContext";
import { AuthLayout } from "./components/layout/AuthLayout";
import { ChatLayout } from "./components/layout/ChatLayout";

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <AuthLayout />;
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
