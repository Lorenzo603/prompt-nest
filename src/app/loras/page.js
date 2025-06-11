'use client';

import React, { useRef } from "react";
import PromptForm from "../../components/PromptForm";
import PromptSearch from "../../components/PromptSearch";
import Sidebar from "@/components/Sidebar";

export default function LorasPage() {
  const promptSearchRef = useRef();

  const handlePromptAdded = () => {
    if (promptSearchRef.current) {
      promptSearchRef.current.refresh();
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-48 transition-all duration-300">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">🪺 PromptNest 🪺</h1>
          <PromptForm onPromptAdded={handlePromptAdded} />
          <PromptSearch ref={promptSearchRef} />
        </div>
      </main>
    </div>
  );
}
