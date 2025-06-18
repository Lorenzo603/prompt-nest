'use client';

import React, { useRef } from "react";
import PromptForm from "../../components/PromptForm";
import PromptSearch from "../../components/Search/PromptSearch";
import Sidebar from "../../components/Sidebar";

export default function PromptsPage() {
  const promptSearchRef = useRef();
  const handlePromptAdded = () => {
    if (promptSearchRef.current) {
      promptSearchRef.current.refresh();
    }
  };
  const handlePromptUpdated = () => {
    if (promptSearchRef.current) {
      promptSearchRef.current.refresh();
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-48 transition-all duration-300">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Prompts</h1>
          <PromptForm onPromptAdded={handlePromptAdded} />
          <PromptSearch ref={promptSearchRef} onPromptUpdated={handlePromptUpdated} />
        </div>
      </main>
    </div>
  );
}
