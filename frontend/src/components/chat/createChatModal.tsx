import React, { useState } from "react";
import Button from "../ui/Button";
import { Search } from "lucide-react";
import type { User } from "@/types/auth.type";
import { searchUsers } from "@/lib/apis/user";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "direct" | "group";
  //   onChatCreated: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  type,
  //   onChatCreated,
}) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const res = await searchUsers(search);
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateChat = async () => {
    if (!selectedUsers.length) return alert("Select at least one user");

    try {
      const participants = selectedUsers.map((u) => ({ userId: u.id }));
      const name = type === "group" ? undefined : selectedUsers[0].name;
      //   await createChat({ type, name, participants, lastMessage: message });
      //   onChatCreated();
      //   onClose();
      //   setSelectedUsers([]);
      //   setMessage("");
      //   setSearch("");
      //   setResults([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create chat");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] max-w-full">
        <h2 className="text-lg font-bold mb-4">
          {type === "group" ? "New Group" : "New Chat"}
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded border-neutral-300 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 text-white bg-orange-500 px-3 py-1 rounded hover:bg-orange-600 text-sm"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
          {loading ? (
            <p>Loading...</p>
          ) : (
            results.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleUserSelection(user)}
                className={`p-2 border rounded cursor-pointer flex justify-between items-center ${
                  selectedUsers.find((u) => u.id === user.id)
                    ? "bg-orange-100"
                    : ""
                }`}
              >
                <span>{user.name}</span>
                <span className="text-sm text-neutral-500">{user.email}</span>
              </div>
            ))
          )}
        </div>

        {/* Optional message */}
        {type === "direct" && (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional message..."
            className="w-full border border-neutral-300 rounded p-2 mb-4 focus:outline-none focus:border-orange-500"
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="bg-neutral-300 hover:bg-neutral-400 text-black"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
