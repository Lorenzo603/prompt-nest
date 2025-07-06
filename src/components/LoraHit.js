"use client";

import React, { useState } from "react";
import { Highlight } from "react-instantsearch";
import LoraEditModal from "./LoraEditModal";

const LoraHit = ({ hit, onLoraUpdated }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedTriggerWords, setCopiedTriggerWords] = useState({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/loras`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hit.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete lora');
      }

      setIsDeleteModalOpen(false);
      // Trigger refresh of search results
      onLoraUpdated && onLoraUpdated();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete lora. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const copyTriggerWord = async (word, index) => {
    try {
      await navigator.clipboard.writeText(word);
      setCopiedTriggerWords(prev => ({ ...prev, [index]: true }));

      // Hide tooltip after 2 seconds
      setTimeout(() => {
        setCopiedTriggerWords(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy trigger word:', error);
    }
  };

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  return (
    <>
      <div className="mb-6 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full tracking-wide">
                <Highlight hit={hit} attribute="baseModel" />
              </span>
              <h3 className="text-xl font-bold text-gray-800">
                <Highlight hit={hit} attribute="name" />
              </h3>
              {hit.version && (
                <span className="px-2 py-1 bg-blue-500 text-white text-sm font-bold rounded-md">
                  {hit.version}
                </span>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {hit.hash && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5.6,10.25L7.85,12.5L5.6,14.75L6.7,15.85L9.95,12.5L6.7,9.15L5.6,10.25M12.25,4V6H17.75A1.75,1.75 0 0,1 19.5,7.75V16.25A1.75,1.75 0 0,1 17.75,18H6.25A1.75,1.75 0 0,1 4.5,16.25V7.75A1.75,1.75 0 0,1 6.25,6H11.75V4H12.25Z" />
                    </svg>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {hit.hash.substring(0, 12)}...
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <span className="text-gray-500">ID: #{hit.id}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium cursor-pointer flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
                Delete
              </button>
            </div>
          </div>

        </div>

        {/* Content Section */}
        <div className="p-4 space-y-4">
          <div className="flex gap-4">
            {/* Left side - Main content */}
            <div className="flex-1 space-y-4">
              {hit.description && (
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-purple-400">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <Highlight hit={hit} attribute="description" />
                  </p>
                </div>
              )}

              {hit.triggerWords && hit.triggerWords.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">Trigger Words:</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {hit.triggerWords.map((word, index) => (
                      <div key={index} className="relative">
                        <button
                          onClick={() => copyTriggerWord(word, index)}
                          className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1.5 rounded-full hover:bg-yellow-200 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 border border-yellow-200 font-medium"
                        >
                          <Highlight hit={hit} attribute={`triggerWords.${index}`} />
                        </button>

                        {/* Tooltip */}
                        {copiedTriggerWords[index] && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
                            Copied!
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hit.urls && hit.urls.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39C7.36,13 7.36,12.4 7.77,12L9.19,10.59C9.6,10.2 10.2,10.2 10.59,10.59C11,11 11,11.6 10.59,12L10.24,12.35L11.65,13.76L13.06,12.35L12.71,12C12.3,11.6 12.3,11 12.71,10.59C13.1,10.2 13.7,10.2 14.11,10.59L15.53,12C15.94,12.4 15.94,13 15.53,13.39L14.11,14.81C13.7,15.2 13.1,15.2 12.71,14.81C12.3,14.4 12.3,13.8 12.71,13.41L13.06,13.06L11.65,11.65L10.24,13.06L10.59,13.41Z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">URLs:</span>
                  </div>
                  <div className="grid gap-2">
                    {hit.urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 text-sm p-2 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors break-all border border-purple-200"
                      >
                        {url.length > 100 ? `${url.substring(0, 100)}...` : url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {hit.settings && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">Settings:</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{hit.settings}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Image */}
            {hit.imageUrl && (
              <div className="w-64 flex-shrink-0">
                <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border">
                  <img
                    src={hit.imageUrl}
                    alt={hit.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={handleImageClick}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hit.filename && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <div>
                    <span className="text-sm font-medium text-blue-800">Filename:</span>
                    <span className="text-sm text-blue-700 ml-2 font-mono">{hit.filename}</span>
                  </div>
                </div>
              )}
              {hit.publishedDate && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M16.5,16H7.5V14.5H16.5V16M19,12H5V10.5H19V12M16.5,8H7.5V6.5H16.5V8Z" />
                  </svg>
                  <div>
                    <span className="text-sm font-medium text-green-800">Published:</span>
                    <span className="text-sm text-green-700 ml-2 font-medium">{formatDate(hit.publishedDate)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {hit.tags && hit.tags.length > 0 && hit.tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-300 transition-colors">
                  <Highlight hit={hit} attribute={`tags.${index}`} />
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
              </svg>
              <span>{new Date(hit.creationDate).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div >

      {/* Edit Modal */}
      {
        isEditModalOpen && (
          <LoraEditModal
            lora={hit}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedLora) => {
              setIsEditModalOpen(false);
              onLoraUpdated && onLoraUpdated(updatedLora);
            }}
          />
        )
      }

      {/* Delete Confirmation Modal */}
      {
        isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Lora</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete &ldquo;<strong>{hit.name}</strong>&rdquo;? This action cannot be undone.
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
        )
      }

      {/* Image Modal */}
      {isImageModalOpen && hit.imageUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div 
            className="max-w-4xl max-h-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Close image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={hit.imageUrl}
              alt={hit.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
              <h3 className="text-white font-semibold text-lg">{hit.name}</h3>
              {hit.version && (
                <p className="text-gray-300 text-sm">Version: {hit.version}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoraHit;
