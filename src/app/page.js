'use client';

import Image from "next/image";
import React, { useRef } from "react";
import PromptForm from "../components/PromptForm";
import PromptList from "../components/PromptList";

export default function Home() {
  const promptListRef = useRef();
  const handlePromptAdded = () => {
    if (promptListRef.current) {
      promptListRef.current.refresh();
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Prompt App</h1>
      <PromptForm onPromptAdded={handlePromptAdded} />
      <PromptList ref={promptListRef} />
    </div>
  );
}
