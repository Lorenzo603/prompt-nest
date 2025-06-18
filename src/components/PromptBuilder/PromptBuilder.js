'use client';

import React, { useState, useRef, useEffect } from "react";

export default function PromptBuilder() {
  const [categoryValues, setCategoryValues] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([
    'style', 'subject', 'lighting', 'environment', 'color', 
    'perspective', 'background', 'mood', 'composition', 'technique'
  ]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState({});
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState({});

  const getCategoryColor = (category) => {
    const colors = {
      'style': 'bg-purple-100 text-purple-800 border-purple-200',
      'subject': 'bg-blue-100 text-blue-800 border-blue-200',
      'lighting': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'environment': 'bg-green-100 text-green-800 border-green-200',
      'color': 'bg-pink-100 text-pink-800 border-pink-200',
      'perspective': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'background': 'bg-gray-100 text-gray-800 border-gray-200',
      'mood': 'bg-orange-100 text-orange-800 border-orange-200',
      'composition': 'bg-teal-100 text-teal-800 border-teal-200',
      'technique': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[category.toLowerCase()] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getCategoryPlaceholder = (category) => {
    const placeholders = {
      'style': 'photo, painting, pixel art...',
      'subject': 'person, animal, landscape...',
      'lighting': 'soft, ambient, ring light, neon, sun rays...',
      'environment': 'indoor, outdoor, underwater, in space...',
      'color': 'vibrant, dark, pastel...',
      'perspective': 'front, overhead, side...',
      'background': 'solid color, nebula, forest...',
      'mood': 'serene, dramatic, intense...',
      'composition': 'symmetrical, diagonal, rule of thirds...',
      'technique': 'shallow depth of field, long exposure, HDR...',
    };
    return placeholders[category.toLowerCase()] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getCategorySuggestions = (category) => {
    const suggestions = {
      'style': [
        'photorealistic', 'digital art', 'oil painting', 'watercolor', 'pencil sketch',
        'cartoon style', 'anime style', '3D render', 'pixel art', 'impressionist',
        'renaissance style', 'art nouveau', 'cyberpunk', 'steampunk', 'minimalist'
      ],
      'subject': [
        'beautiful woman', 'handsome man', 'cute child', 'majestic dragon', 'fluffy cat',
        'loyal dog', 'ancient tree', 'blooming flower', 'modern building', 'vintage car',
        'mystical creature', 'elegant dancer', 'wise elder', 'playful kitten', 'noble horse'
      ],
      'lighting': [
        'soft natural light', 'dramatic lighting', 'golden hour', 'blue hour', 'candlelight',
        'neon lighting', 'moonlight', 'sunlight', 'studio lighting', 'backlighting',
        'rim lighting', 'ambient lighting', 'harsh shadows', 'diffused light', 'spotlight'
      ],
      'environment': [
        'enchanted forest', 'bustling city', 'serene beach', 'snow-capped mountains', 'cozy indoor',
        'vast desert', 'underwater scene', 'outer space', 'medieval castle', 'modern office',
        'rustic cabin', 'futuristic city', 'tropical island', 'arctic tundra', 'ancient ruins'
      ],
      'color': [
        'vibrant colors', 'muted tones', 'monochrome', 'pastel palette', 'dark and moody',
        'bright and cheerful', 'earth tones', 'cool blues', 'warm oranges', 'rich purples',
        'golden hues', 'silver accents', 'rainbow colors', 'black and white', 'sepia tones'
      ],
      'perspective': [
        'front view', 'side profile', 'three-quarter view', 'overhead shot', 'low angle',
        'high angle', 'close-up', 'wide shot', 'macro photography', 'bird\'s eye view',
        'worm\'s eye view', 'Dutch angle', 'over-the-shoulder', 'first person view', 'panoramic'
      ],
      'background': [
        'solid color background', 'gradient background', 'bokeh background', 'starry sky',
        'forest backdrop', 'city skyline', 'mountain range', 'ocean waves', 'cloudy sky',
        'brick wall', 'wooden texture', 'marble surface', 'abstract pattern', 'blurred lights'
      ],
      'mood': [
        'peaceful and serene', 'dramatic and intense', 'mysterious and dark', 'cheerful and bright',
        'melancholic and somber', 'energetic and dynamic', 'romantic and dreamy', 'ominous and foreboding',
        'nostalgic and vintage', 'futuristic and clean', 'cozy and warm', 'epic and grand'
      ],
      'composition': [
        'rule of thirds', 'centered composition', 'leading lines', 'framing', 'symmetrical',
        'asymmetrical balance', 'diagonal composition', 'spiral composition', 'golden ratio',
        'negative space', 'depth of field', 'layered composition', 'tight crop', 'wide composition'
      ],
      'technique': [
        'shallow depth of field', 'long exposure', 'HDR photography', 'tilt-shift', 'double exposure',
        'light painting', 'macro photography', 'telephoto compression', 'wide-angle distortion',
        'motion blur', 'freeze motion', 'selective focus', 'cross-processing', 'film grain'
      ]
    };
    return suggestions[category.toLowerCase()] || [];
  };

  const handleInputChange = (category, value) => {
    setCategoryValues(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleInputFocus = (category) => {
    setShowSuggestions(prev => ({
      ...prev,
      [category]: true
    }));
    setActiveSuggestionIndex(prev => ({
      ...prev,
      [category]: -1
    }));
  };

  const handleInputBlur = (category) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(prev => ({
        ...prev,
        [category]: false
      }));
    }, 200);
  };

  const handleSuggestionClick = (category, suggestion) => {
    setCategoryValues(prev => ({
      ...prev,
      [category]: suggestion
    }));
    setShowSuggestions(prev => ({
      ...prev,
      [category]: false
    }));
  };

  const handleKeyDown = (e, category) => {
    const suggestions = getFilteredSuggestions(category);
    const currentIndex = activeSuggestionIndex[category] || -1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
      setActiveSuggestionIndex(prev => ({
        ...prev,
        [category]: newIndex
      }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
      setActiveSuggestionIndex(prev => ({
        ...prev,
        [category]: newIndex
      }));
    } else if (e.key === 'Enter' && currentIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(category, suggestions[currentIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(prev => ({
        ...prev,
        [category]: false
      }));
    }
  };

  const getFilteredSuggestions = (category) => {
    const allSuggestions = getCategorySuggestions(category);
    const currentValue = categoryValues[category] || '';
    
    if (!currentValue.trim()) {
      return allSuggestions.slice(0, 8); // Show first 8 when empty
    }
    
    return allSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(currentValue.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 suggestions
  };

  const generatePrompt = () => {
    const promptParts = categoryOrder
      .map(category => categoryValues[category])
      .filter(value => value && value.trim() !== '');
    
    return promptParts.join(', ');
  };

  const handleDragStart = (e, category) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== targetCategory) {
      const newOrder = [...categoryOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(targetCategory);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);
      
      setCategoryOrder(newOrder);
    }
    
    setDraggedItem(null);
  };

  const clearCategory = (category) => {
    setCategoryValues(prev => ({
      ...prev,
      [category]: ''
    }));
  };

  const clearAll = () => {
    setCategoryValues({});
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Prompt Builder</h1>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Category Inputs */}
      <div className="space-y-4 mb-8">
        {categoryOrder.map((category) => (
          <div
            key={category}
            draggable
            onDragStart={(e) => handleDragStart(e, category)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category)}
            className={`bg-white border-2 rounded-lg p-4 cursor-move transition-all duration-200 ${
              draggedItem === category ? 'opacity-50 transform scale-95' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 text-gray-400 cursor-grab">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z" />
                  </svg>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </div>
              {categoryValues[category] && (
                <button
                  onClick={() => clearCategory(category)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={categoryValues[category] || ''}
                onChange={(e) => handleInputChange(category, e.target.value)}
                onFocus={() => handleInputFocus(category)}
                onBlur={() => handleInputBlur(category)}
                onKeyDown={(e) => handleKeyDown(e, category)}
                placeholder={getCategoryPlaceholder(category)}
                className="w-full p-3 border border-gray-300 text-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions[category] && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto text-slate-800">
                  {getFilteredSuggestions(category).map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(category, suggestion)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                        activeSuggestionIndex[category] === index ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                  {getFilteredSuggestions(category).length === 0 && (
                    <div className="px-4 py-2 text-gray-500 italic">
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Generated Prompt Output */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Prompt</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[100px]">
          {generatePrompt() ? (
            <p className="text-gray-700 leading-relaxed">
              {generatePrompt()}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              Start filling in the categories above to generate your prompt...
            </p>
          )}
        </div>
        
        {generatePrompt() && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(generatePrompt())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
            >
              Copy Prompt
            </button>
            <button
              onClick={() => {
                const parts = generatePrompt().split(', ');
                console.log('Prompt parts:', parts);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
            >
              Analyze Parts
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">How to use:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Fill in any categories you want to include in your prompt</li>
          <li>• Start typing to see suggestions, or enter your own text</li>
          <li>• Drag and drop categories to reorder them</li>
          <li>• The generated prompt will update automatically</li>
          <li>• Use the copy button to copy the final prompt</li>
        </ul>
      </div>
    </div>
  );
}
