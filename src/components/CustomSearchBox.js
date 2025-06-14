"use client";

import React from "react";
import { useSearchBox } from "react-instantsearch";

const CustomSearchBox = ({ 
  placeholder = "Search...", 
  colorTheme = "blue" 
}) => {
  const { query, refine, clear } = useSearchBox();

  // Color themes for different entity types
  const themes = {
    blue: {
      focus: "focus:ring-blue-400",
      buttonText: "text-blue-500",
      buttonHover: "hover:text-blue-600"
    },
    green: {
      focus: "focus:ring-green-400",
      buttonText: "text-green-500", 
      buttonHover: "hover:text-green-600"
    },
    purple: {
      focus: "focus:ring-purple-400",
      buttonText: "text-purple-600",
      buttonHover: "hover:text-purple-700"
    }
  };

  const theme = themes[colorTheme] || themes.blue;

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleReset = () => {
    clear();
  };

  const handleInputChange = (event) => {
    refine(event.target.value);
  };

  return (
    <form className="relative mb-4" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`pl-10 pr-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 ${theme.focus} text-gray-800 bg-gray-50`}
      />
      {query ? (
        <button
          type="button"
          onClick={handleReset}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-none border-none p-1 cursor-pointer ${theme.buttonText} ${theme.buttonHover}`}
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : (
        <button
          type="submit"
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-none border-none p-1 cursor-pointer ${theme.buttonText} ${theme.buttonHover}`}
          aria-label="Search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </form>
  );
};

export default CustomSearchBox;
