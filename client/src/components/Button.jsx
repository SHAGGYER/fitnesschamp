import React from "react";

export default function Button({ children, onClick, variant, disabled, type }) {
  const config = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
    error: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
  };

  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={
        config[variant] +
        " px-4 py-2 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {children}
    </button>
  );
}
