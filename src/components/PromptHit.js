"use client";

import React from "react";
import { Highlight } from "react-instantsearch";

const PromptHit = ({ hit }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
            <Highlight hit={hit} attribute="type" />
          </span>
          <span className="text-xs text-gray-400">#{hit.id}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-800 whitespace-pre-wrap text-sm">
          <Highlight hit={hit} attribute="text" />
        </p>
      </div>
      
      <div className="flex justify-between items-center flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {hit.tags && hit.tags.length > 0 && hit.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              <Highlight hit={hit} attribute={`tags.${index}`} />
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500">{new Date(hit.creationDate).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PromptHit;
