"use client";

import React, { useState } from "react";
import { useInstantSearch } from "react-instantsearch";

const BaseModelFilter = ({ 
  onBaseModelFilterChange, 
  placeholder = "Filter by base model (comma separated, e.g., SDXL, SD1.5)",
  colorTheme = "purple" // blue, purple, green
}) => {
  const [baseModelFilter, setBaseModelFilter] = useState("");
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

  const handleBaseModelFilterChange = (e) => {
    const value = e.target.value;
    setBaseModelFilter(value);
    
    // Parse base models from input (comma separated)
    const baseModels = value.split(",").map(model => model.trim()).filter(Boolean);
    
    // Get existing filters and preserve tag filters
    const currentFilters = indexUiState?.configure?.filters || '';
    
    // Remove any existing baseModel filters
    let newFilters = currentFilters.replace(/baseModel:[^&|()]+(\s*\|\|\s*baseModel:[^&|()]+)*/g, '').trim();
    
    // Clean up any leftover operators
    newFilters = newFilters.replace(/^\s*&&\s*/, '').replace(/\s*&&\s*$/, '');
    
    if (baseModels.length > 0) {
      // Create filter for base models - any of the base models can match
      const baseModelFilterConditions = baseModels.map(model => `baseModel:${model}`).join(" || ");
      
      if (newFilters) {
        newFilters = `(${newFilters}) && (${baseModelFilterConditions})`;
      } else {
        newFilters = baseModelFilterConditions;
      }
    }
    
    setIndexUiState({
      ...indexUiState,
      configure: {
        ...indexUiState.configure,
        filters: newFilters,
      },
    });
    
    onBaseModelFilterChange && onBaseModelFilterChange(baseModels);
  };

  return (
    <div>
      <input
        type="text"
        value={baseModelFilter}
        onChange={handleBaseModelFilterChange}
        placeholder={placeholder}
        className={`px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 ${theme.focusRing} text-gray-800 bg-gray-50`}
      />
      {baseModelFilter && (
        <div className="mt-2 text-sm text-gray-600">
          Filtering by base model: {baseModelFilter.split(",").map(model => model.trim()).filter(Boolean).map((model, index) => (
            <span key={index} className={`inline-block ${theme.chipBg} ${theme.chipText} text-xs px-2 py-1 rounded-full mr-1`}>
              {model}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BaseModelFilter;
