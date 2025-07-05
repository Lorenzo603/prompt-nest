'use client';

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";

export default function PromptStylesPage() {
  const [copiedStyle, setCopiedStyle] = useState(null);
  const [promptStyles, setPromptStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullPrompt, setShowFullPrompt] = useState(null);

  // Fetch prompt styles from API
  useEffect(() => {
    const fetchPromptStyles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/prompt-styles');
        if (!response.ok) {
          throw new Error('Failed to fetch prompt styles');
        }
        const data = await response.json();
        setPromptStyles(data);
      } catch (err) {
        console.error('Error fetching prompt styles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromptStyles();
  }, []);

  const handleImageClick = async (style) => {
    try {
      await navigator.clipboard.writeText(style.prompt);
      setCopiedStyle(style.id);
      setTimeout(() => setCopiedStyle(null), 2000);
      closeModal();
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleShowMore = (e, style) => {
    e.stopPropagation(); // Prevent triggering the image click
    setShowFullPrompt(style);
  };

  const closeModal = () => {
    setShowFullPrompt(null);
  };

  const isPromptTruncated = (prompt) => {
    return prompt && prompt.length > 150; // Adjust this threshold as needed
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-48 transition-all duration-300">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Prompt Styles</h1>
            <p className="text-slate-300">Click on any image to copy its prompt to clipboard</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-100"></div>
              <span className="ml-3 text-slate-300">Loading prompt styles...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2ZM13,17H11V15H13V17ZM13,13H11V7H13V13Z" />
                </svg>
                <span className="text-red-800 font-medium">Error loading prompt styles: {error}</span>
              </div>
            </div>
          )}

          {/* Styles Grid */}
          {!loading && !error && (
            <>
              {promptStyles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No prompt styles found</h3>
                  <p className="text-slate-400">Add some images and JSON metadata files to the dam/prompt-styles directory to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promptStyles.map((style) => (
                    <div
                      key={style.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                      onClick={() => handleImageClick(style)}
                    >
                      {/* Image Container */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={style.imageUrl}
                          alt={style.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNHB4Ij5JbWFnZSBQbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';
                          }}
                        />

                        {/* Copy Indicator Overlay */}
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Click to copy
                          </div>
                        </div>

                        {/* Copied Notification */}
                        {copiedStyle === style.id && (
                          <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center">
                            <div className="text-white font-bold text-lg flex items-center gap-2">
                              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                              </svg>
                              Copied!
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {style.title}
                        </h3>

                        {/* Prompt */}
                        <div className="relative">
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-2">
                            {style.prompt}
                          </p>
                          {isPromptTruncated(style.prompt) && (
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => handleShowMore(e, style)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline cursor-pointer"
                              >
                                Show More
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Instructions */}
          {!loading && promptStyles.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">How to use:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Browse through different art styles and their example images</li>
                <li>• Click on any image to copy its associated prompt to your clipboard</li>
                <li>• Use these prompts as starting points for your own creations</li>
                <li>• Modify and combine prompts to create unique styles</li>
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Full Prompt Modal */}
      {showFullPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{showFullPrompt.title}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>

              {/* Modal Image */}
              <div className="mb-4">
                <img
                  src={showFullPrompt.imageUrl}
                  alt={showFullPrompt.title}
                  className="w-full h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNHB4Ij5JbWFnZSBQbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';
                  }}
                />
              </div>

              {/* Modal Content */}
              <div className="max-h-64 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Full Prompt:</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                  {showFullPrompt.prompt}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleImageClick(showFullPrompt)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A1,1 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                  </svg>
                  Copy Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
