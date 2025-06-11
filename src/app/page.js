'use client';

import React, { useRef } from "react";
import PromptForm from "../components/PromptForm";
import PromptSearch from "../components/PromptSearch";

export default function Home() {
  const promptSearchRef = useRef();
  
  const handlePromptAdded = () => {
    // Refresh the search results when a new prompt is added
    if (promptSearchRef.current) {
      promptSearchRef.current.refresh();
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🪺 PromptNest 🪺</h1>
      <PromptForm onPromptAdded={handlePromptAdded} />
      <PromptSearch ref={promptSearchRef} />
    </div>
  );
}
