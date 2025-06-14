"use client";

import React, { useState } from "react";
import { useInstantSearch } from "react-instantsearch";

const TagFilter = ({ 
  onTagFilterChange, 
  placeholder = "Filter by tags (comma separated)",
  colorTheme = "blue" // blue, purple, green
}) => {
  const [tagFilter, setTagFilter] = useState("");
  const { setIndexUiState, indexUiState } = useInstantSearch();

  // Color theme configurations
  const colorThemes = {
    blue: {
      focusRing: "focus:ring-blue-400",
      chipBg: "bg-blue-100",
      chipText: "text-blue-700"
    },
    purple: {
      focusRing: "focus:ring-purple-400",
      chipBg: "bg-purple-100",
      chipText: "text-purple-700"
    },
    green: {
      focusRing: "focus:ring-green-400",
      chipBg: "bg-green-100",
      chipText: "text-green-700"
    }
  };

  const theme = colorThemes[colorTheme] || colorThemes.blue;

  const handleTagFilterChange = (e) => {
    const value = e.target.value;
    setTagFilter(value);
    
    // Parse tags from input (comma separated)
    const tags = value.split(",").map(tag => tag.trim()).filter(Boolean);
    
    if (tags.length === 0) {
      // No tags filter, clear any existing filter
      setIndexUiState({
        ...indexUiState,
        configure: {
          ...indexUiState.configure,
          filters: '',
        },
      });
    } else {
      // Create filter for tags - all tags must be present
      const filterConditions = tags.map(tag => `tags:${tag}`).join(" && ");
      setIndexUiState({
        ...indexUiState,
        configure: {
          ...indexUiState.configure,
          filters: filterConditions,
        },
      });
    }
    
    onTagFilterChange && onTagFilterChange(tags);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={tagFilter}
        onChange={handleTagFilterChange}
        placeholder={placeholder}
        className={`px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 ${theme.focusRing} text-gray-800 bg-gray-50`}
      />
      {tagFilter && (
        <div className="mt-2 text-sm text-gray-600">
          Filtering by tags: {tagFilter.split(",").map(tag => tag.trim()).filter(Boolean).map((tag, index) => (
            <span key={index} className={`inline-block ${theme.chipBg} ${theme.chipText} text-xs px-2 py-1 rounded-full mr-1`}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagFilter;
