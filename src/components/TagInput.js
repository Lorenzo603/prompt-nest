"use client";

import React, { useState, useEffect, useRef } from "react";

const TagInput = ({ value = [], onChange, placeholder = "Add tags...", className = "", ringColor = "purple" }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch tag suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/tags?query=${encodeURIComponent(query)}`);
      const tags = await response.json();
      setSuggestions(tags.filter(tag => !value.includes(tag.name)));
    } catch (error) {
      console.error('Error fetching tags:', error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, value]);

  const addTag = (tagName) => {
    if (tagName && !value.includes(tagName)) {
      onChange([...value, tagName]);
      setInputValue("");
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        addTag(suggestions[selectedIndex].name);
      } else if (selectedIndex === suggestions.length && inputValue.trim()) {
        // Create new tag option selected
        addTag(inputValue.trim());
      } else if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = suggestions.length + (inputValue.trim() && !suggestions.some(s => s.name.toLowerCase() === inputValue.toLowerCase()) ? 0 : -1);
      setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion.name);
  };

  const handleInputFocus = () => {
    if (inputValue) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const getRingColorClass = () => {
    switch (ringColor) {
      case "green":
        return "focus-within:ring-green-400";
      case "blue":
        return "focus-within:ring-blue-400";
      case "purple":
      default:
        return "focus-within:ring-purple-400";
    }
  };

  const getHighlightColorClass = (selected) => {
    const baseClass = selected ? "text-white" : "text-gray-800";
    switch (ringColor) {
      case "green":
        return selected ? "bg-green-100 text-green-800" : "hover:bg-gray-100 text-gray-800";
      case "blue":
        return selected ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 text-gray-800";
      case "purple":
      default:
        return selected ? "bg-purple-100 text-purple-800" : "hover:bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`min-h-[42px] px-3 py-2 border border-gray-300 rounded focus-within:outline-none focus-within:ring-2 ${getRingColorClass()} text-gray-800 bg-gray-50 flex flex-wrap gap-1 items-center`}>
        {/* Display selected tags */}
        {value.map((tag, index) => (
          <span key={index} className="inline-flex items-center bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
        
        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-3 py-2 cursor-pointer text-sm ${getHighlightColorClass(index === selectedIndex)}`}
            >
              {suggestion.name}
            </div>
          ))}
          {inputValue.trim() && !suggestions.some(s => s.name.toLowerCase() === inputValue.toLowerCase()) && (
            <div
              onClick={() => addTag(inputValue.trim())}
              className={`px-3 py-2 cursor-pointer text-sm border-t border-gray-200 font-medium ${getHighlightColorClass(selectedIndex === suggestions.length)}`}
            >
              + Create "{inputValue.trim()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagInput;
