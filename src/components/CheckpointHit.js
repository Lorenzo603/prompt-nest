"use client";

import React, { useState } from "react";
import { Highlight } from "react-instantsearch";
import CheckpointEditModal from "./CheckpointEditModal";

const CheckpointHit = ({ hit, onCheckpointUpdated }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/checkpoints`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hit.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete checkpoint');
      }

      setIsDeleteModalOpen(false);
      // Trigger refresh of search results
      onCheckpointUpdated && onCheckpointUpdated();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete checkpoint. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">
              <Highlight hit={hit} attribute="baseModel" />
            </span>
            <span className="text-lg font-semibold text-gray-800">
              <Highlight hit={hit} attribute="name" />
            </span>
            <span className="text-xs text-gray-400">#{hit.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer"
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
      
        {hit.description && (
          <p className="text-gray-600 text-sm">
            <Highlight hit={hit} attribute="description" />
          </p>
        )}
        
        {hit.filename && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Filename:</span> {hit.filename}
          </div>
        )}
        
        {hit.urls && hit.urls.length > 0 && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">URLs:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {hit.urls.map((url, index) => (
                <a 
                  key={index} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
                >
                  {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {hit.relatedModels && hit.relatedModels.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Related:</span>
            {hit.relatedModels.map((model, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{model}</span>
            ))}
          </div>
        )}
        
        {hit.settings && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <span className="font-medium">Settings:</span>
            <pre className="text-xs mt-1 whitespace-pre-wrap">{hit.settings}</pre>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2 flex-wrap">
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
        <CheckpointEditModal
          checkpoint={hit}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedCheckpoint) => {
            setIsEditModalOpen(false);
            onCheckpointUpdated && onCheckpointUpdated(updatedCheckpoint);
          }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Checkpoint</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<strong>{hit.name}</strong>"? This action cannot be undone.
              </p>
              
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

export default CheckpointHit;
