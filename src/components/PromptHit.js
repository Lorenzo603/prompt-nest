"use client";

import React, { useState } from "react";
import { Highlight } from "react-instantsearch";
import PromptEditModal from "./PromptEditModal";

const PromptHit = ({ hit, onPromptUpdated }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
              <Highlight hit={hit} attribute="type" />
            </span>
            <span className="text-xs text-gray-400">#{hit.id}</span>
          </div>
          <div className="flex items-center gap-2">
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
