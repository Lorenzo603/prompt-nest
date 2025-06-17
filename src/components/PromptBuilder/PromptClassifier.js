'use client';

import React, { useState } from "react";

export default function PromptClassifier() {
  const [prompt, setPrompt] = useState('');
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('original'); // 'original', 'category', 'confidence'

  const handleClassify = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to classify');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/classify-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt, useOllama: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to classify prompt');
      }

      const data = await response.json();
      const classificationWithIndex = data.classification.map((item, index) => ({
        ...item,
        originalIndex: index
      }));
      setClassification(classificationWithIndex);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const getSortedClassification = () => {
    if (!classification) return [];

    const sorted = [...classification];

    switch (sortBy) {
      case 'category':
        return sorted.sort((a, b) => {
          const aFirstCategory = a.categories[0] || '';
          const bFirstCategory = b.categories[0] || '';
          return aFirstCategory.localeCompare(bFirstCategory);
        });
      case 'confidence':
        return sorted.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
      case 'original':
      default:
        return sorted.sort((a, b) => a.originalIndex - b.originalIndex);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-slate-100">Prompt Classifier</h1>

      {/* Input Section */}
      <div className="mb-6">
        <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-100 mb-2">
          Enter your prompt to classify:
        </label>
        <div className="flex gap-3">
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here... (e.g., 'A majestic dragon in a mystical forest with soft moonlight filtering through ancient trees')"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleClassify}
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Classifying...
              </div>
            ) : (
              'Classify'
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      )}

      {/* Results Section */}
      {classification && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-2xl font-semibold text-slate-100">
              Classification Results
            </h2>

            {/* Sort Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-200">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="original">Original Order</option>
                <option value="category">Category</option>
                <option value="confidence">Confidence</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            {getSortedClassification().map((item, displayIndex) => (
              <div key={`${item.originalIndex}-${displayIndex}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mb-3">

                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-gray-700 italic">"{item.text}"</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.categories.map((category, catIndex) => (
                      <span
                        key={catIndex}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>


                {item.confidence && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <span className="text-xs text-gray-600 font-medium">{item.confidence}%</span>
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Summary</h3>
            <div className="space-y-1">
              <p className="text-blue-700">
                Found <span className="font-semibold">{classification.length}</span> distinct parts in your prompt across{' '}
                <span className="font-semibold">
                  {[...new Set(classification.flatMap(item => item.categories))].length}
                </span>{' '}
                different categories.
              </p>
              <p className="text-blue-600 text-sm">
                Currently sorted by: <span className="font-semibold">
                  {sortBy === 'original' ? 'Original Order' :
                    sortBy === 'category' ? 'Category (A-Z)' :
                      'Confidence (High to Low)'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">How it works:</h3>
        <p className="text-sm text-gray-600">
          The classifier analyzes your prompt and breaks it down into meaningful parts, then categorizes each part
          (e.g., style, subject, lighting, environment). This helps you understand the structure of your prompt
          and identify areas for improvement or expansion.
        </p>
      </div>
    </div>
  );
}
