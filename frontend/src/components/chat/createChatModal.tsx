import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { Search } from "lucide-react";
import type { User } from "@/types/auth.type";
import { toast } from "react-toastify";
import { callSearchUsersApi } from "@/lib";
import { useChatStore } from "@/stores";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "direct" | "group";
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  const { fetchChats, createChat } = useChatStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await callSearchUsersApi(query.trim());
        if (res.success) {
          setResults(res.data);
        } else {
          setResults([]);
          toast.error(res.error);
        }
      } catch (err) {
        toast.error((err as any)?.message || "failed to search users");
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const toggleUser = (user: User) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const resetState = () => {
    setQuery("");
    setResults([]);
    setSelectedUsers([]);
    setGroupName("");
    setCreating(false);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!selectedUsers.length) return alert("Select at least one user");
    setCreating(true);
    try {
      if (type === "direct") {
        const participant = selectedUsers[0];
        await createChat("direct", [participant.id]);
      } else {
        if (!groupName.trim()) {
          setCreating(false);
          return alert("Please enter a group name");
        }
        const ids = selectedUsers.map((u) => u.id);
        await createChat("group", ids, groupName);
      }
      await fetchChats();
      resetState();
      onClose();
    } catch (err) {
      setCreating(false);
      toast.error((err as any)?.message || "Failed to create chat");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] max-w-full">
        <h2 className="text-lg font-bold mb-4">
          {type === "group" ? "New Group" : "New Chat"}
        </h2>

        {type === "group" && (
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name..."
            className="w-full border border-neutral-300 rounded p-2 mb-4 
                       focus:outline-none focus:border-orange-500"
          />
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded border-neutral-300 
                       focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Results */}
        <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
          {loading ? (
            <p>Loading...</p>
          ) : results.length ? (
            results.map((user) => {
              const isSelected = selectedUsers.some((u) => u.id === user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user)}
                  className={`p-2 border rounded cursor-pointer flex justify-between items-center transition 
                    ${isSelected ? "bg-orange-100" : "hover:bg-neutral-100"}`}
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                  </div>
                  {isSelected && (
                    <span className="text-orange-600 text-sm font-semibold">
                      ✓
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            query && <p>No users found</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="bg-neutral-300 hover:bg-neutral-400 text-black px-3 py-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating}
            className="bg-orange-500 hover:bg-orange-600 text-white 
                       disabled:opacity-50 px-3 py-1"
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};
