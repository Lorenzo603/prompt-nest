'use client';

import React, { useState } from "react";

export default function PromptEnhancer() {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleEnhance = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt before enhancing.");
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance prompt.");
      }

      if (!data.enhancedPrompt || typeof data.enhancedPrompt !== "string") {
        throw new Error("Received an invalid enhancement response.");
      }

      setEnhancedPrompt(data.enhancedPrompt.trim());
    } catch (err) {
      if (err.name === "AbortError") {
        setError("The enhancement request timed out. Please try again.");
      } else {
        setError(err.message || "Unable to enhance prompt right now. Please try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!enhancedPrompt) return;

    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      setShowCheckmark(true);
      setShowCopiedTooltip(true);
      setTimeout(() => {
        setShowCheckmark(false);
        setShowCopiedTooltip(false);
      }, 2000);
    } catch {
      setError("Failed to copy prompt. Please copy manually.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl rounded-xl border border-cyan-800/50 bg-slate-900/50">
      <h2 className="text-2xl font-bold mb-4 text-slate-100">Prompt Enhancer</h2>

      <div className="space-y-3">
        <label htmlFor="prompt-enhancer-input" className="block text-sm font-medium text-slate-200">
          Paste your raw prompt:
        </label>

        <textarea
          id="prompt-enhancer-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y min-h-[110px] text-slate-800 bg-white"
          rows={4}
          disabled={loading}
        />

        <button
          onClick={handleEnhance}
          disabled={loading || !prompt.trim()}
          className="px-5 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200 font-medium cursor-pointer min-w-[130px]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enhancing...</span>
            </span>
          ) : (
            "Enhance"
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-200">Enhanced Prompt</h3>
          {enhancedPrompt && (
            <div className="relative">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-slate-200 rounded-md border border-slate-500/70 hover:bg-slate-800 transition-colors duration-200 text-sm font-medium flex items-center gap-2 cursor-pointer"
                title="Copy prompt to clipboard"
              >
                {showCheckmark ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A1,1 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                  </svg>
                )}
                Copy
              </button>
              {showCopiedTooltip && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap z-10">
                  Copied!
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-lg min-h-[96px]">
          {enhancedPrompt ? (
            <p className="text-slate-800 whitespace-pre-wrap">{enhancedPrompt}</p>
          ) : (
            <p className="text-slate-500">Your enhanced prompt will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
