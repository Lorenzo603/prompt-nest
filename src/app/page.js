'use client';

import React from "react";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to PromptNest 🪺</h1>
      <p className="mb-8 text-lg">Choose a section to manage your AI assets:</p>
      <div className="flex flex-col gap-4 max-w-xs mx-auto">
        <a href="/prompt-styles" className="px-4 py-3 bg-orange-600 text-white rounded shadow hover:bg-orange-700 transition-colors text-center font-semibold">🪺 Prompt Styles</a>
        <a href="/prompt-builder" className="px-4 py-3 bg-gray-600 text-white rounded shadow hover:bg-gray-700 transition-colors text-center font-semibold">🪺 Prompt Builder</a>
        <a href="/prompts" className="px-4 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors text-center font-semibold">🪺 Prompts</a>
        <a href="/checkpoints" className="px-4 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors text-center font-semibold">🪧 Checkpoints</a>
        <a href="/loras" className="px-4 py-3 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition-colors text-center font-semibold">🧬 LoRAs</a>
      </div>
    </div>
  );
}
