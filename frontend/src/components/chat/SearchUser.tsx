import React, { useState, useEffect } from "react";

const SearchUsers = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [search, setSearch] = useState("");

  

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        className="w-full pl-10 pr-20 py-2 border rounded border-neutral-300 
                   focus:outline-none focus:border-orange-500"
      />
    </div>
  );
};

export default SearchUsers;
