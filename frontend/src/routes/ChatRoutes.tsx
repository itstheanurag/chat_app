import { Route } from "react-router-dom";
import { ProtectedRoute } from "./Guards";
import { ChatLayout } from "@/components/layout/ChatLayout";

export const ChatRoutes = (
  <>
    <Route
      path="/chat"
      element={
        <ProtectedRoute>
          <ChatLayout />
        </ProtectedRoute>
      }
    />
    {/* future: nested chat routes */}
    {/* <Route path="/chat/:chatId" element={<ChatDetail />} /> */}
    {/* <Route path="/chat/:chatId/archive" element={<ArchiveChat />} /> */}
  </>
);
