'use client';

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";

export default function PromptStylesPage() {
  const [copiedStyle, setCopiedStyle] = useState(null);
  const [promptStyles, setPromptStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
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
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {style.prompt}
                        </p>
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
    </div>
  );
}
