import { MessageCircle, Users } from "lucide-react";
import React, { useState } from "react";
import Button from "../ui/Button";
import { ChatModal } from "./createChatModal";

interface ChatModalProps {
  onChatCreated: () => void; // ✅ Added callback
}
const Modal: React.FC<ChatModalProps> = ({ onChatCreated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"direct" | "group">("direct");

  return (
    <div className="bg-neutral-100 border-b-4 border-neutral-900 p-6">
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={() => {
            setModalType("direct");
            setModalOpen(true);
          }}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          New Chat
        </Button>

        <Button
          onClick={() => {
            setModalType("group");
            setModalOpen(true);
          }}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Users className="h-4 w-4" />
          New Group
        </Button>

        <ChatModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          onChatCreated={onChatCreated}
        />
      </div>
    </div>
  );
};

export default Modal;
