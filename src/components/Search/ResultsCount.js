"use client";

import React from "react";
import { useStats } from "react-instantsearch";

const ResultsCount = ({ colorTheme = "blue" }) => {
  const { nbHits, processingTimeMS, query } = useStats();
  
  const getColorClass = (theme) => {
    const colors = {
      'purple': 'text-purple-400',
      'blue': 'text-blue-400',
      'green': 'text-green-400',
    };
    return colors[theme] || 'text-blue-400';
  };
  
  return (
    <div className="flex items-center justify-between text-sm text-gray-200 mb-4">
      <div>
        {nbHits > 0 ? (
          <>
            <span className={`font-medium ${getColorClass(colorTheme)}`}>
              {nbHits.toLocaleString()}
            </span>
            <span> result{nbHits !== 1 ? 's' : ''}</span>
            {query && (
              <>
                <span> for </span>
                <span className="font-medium">&ldquo;{query}&ldquo;</span>
              </>
            )}
          </>
        ) : (
          <span>No results found{query && ` for "${query}"`}</span>
        )}
      </div>
      <div className="text-gray-500">
        {processingTimeMS}ms
      </div>
    </div>
  );
};

export default ResultsCount;
