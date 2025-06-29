'use client';

import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function PromptStylesPage() {
  const [copiedStyle, setCopiedStyle] = useState(null);

  // Template data structure - replace with real data later
  const promptStyles = [
    {
      id: 1,
      title: "Title sample",
      imageUrl: "/img/title-sample.png",
      prompt: "Example prompt for the style, describing the visual elements, colors, and mood to be captured in the image. Use descriptive language to evoke a specific atmosphere or theme."
    },

  ];

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

          {/* Styles Grid */}
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

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">How to use:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Browse through different art styles and their example images</li>
              <li>• Click on any image to copy its associated prompt to your clipboard</li>
              <li>• Use these prompts as starting points for your own creations</li>
              <li>• Modify and combine prompts to create unique styles</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
