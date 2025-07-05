"use client";

import React, { useState } from "react";
import { Highlight } from "react-instantsearch";
import PromptEditModal from "./PromptEditModal";

const PromptHit = ({ hit, onPromptUpdated }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hit.text);
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/prompts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hit.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete prompt');
      }

      setIsDeleteModalOpen(false);
      // Trigger refresh of search results
      onPromptUpdated && onPromptUpdated();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete prompt. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 p-4 pb-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
              <Highlight hit={hit} attribute="type" />
            </span>
            <span className="text-xs text-gray-400">#{hit.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={handleCopy}
                className="px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy prompt to clipboard"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A1,1 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                </svg>
              </button>
              {showCopiedTooltip && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap z-10">
                  Copied!
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 pt-0">
          <div className="flex gap-4">
            {/* Left side - Main content */}
            <div className="flex-1 space-y-3">
              <div>
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

            {/* Right side - Image */}
            {hit.imageUrl && (
              <div className="w-64 flex-shrink-0">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
                  <img
                    src={hit.imageUrl}
                    alt="Prompt example"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <PromptEditModal
          prompt={hit}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedPrompt) => {
            setIsEditModalOpen(false);
            onPromptUpdated && onPromptUpdated(updatedPrompt);
          }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Prompt</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this prompt? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-3 rounded mb-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {hit.text.length > 100 ? `${hit.text.substring(0, 100)}...` : hit.text}
                </p>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptHit;
