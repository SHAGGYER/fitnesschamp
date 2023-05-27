import React, { useEffect, useState } from "react";
import FloatingTextField from "./FloatingTextField";

export default function Autocomplete({ items, onSelect, label, name }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search.length > 0) {
      setResults(
        items.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setResults([]);
    }
  }, [search]);

  return (
    <div className="relative">
      <FloatingTextField label={label} name="search" onChange={handleChange} />
      {search.length > 0 && (
        <div className="absolute bg-white border border-gray-300 w-full">
          {results.map((item, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSelect(item);
                setSearch("");
              }}
            >
              {item}
            </div>
          ))}
          <div className="absolute bg-white border border-gray-300 w-full p-2">
            <div
              className="cursor-pointer"
              onClick={() => {
                onSelect(search);
                setSearch("");
              }}
            >
              Add {search}...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
