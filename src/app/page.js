'use client';

import Image from "next/image";
import React, { useRef } from "react";
import PromptForm from "../components/PromptForm";
import PromptSearch from "../components/PromptSearch";

export default function Home() {
  const promptListRef = useRef();
  const handlePromptAdded = () => {
    if (promptListRef.current) {
      promptListRef.current.refresh();
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🪺 PromptNest 🪺</h1>
      <PromptForm onPromptAdded={handlePromptAdded} />
      <PromptSearch />
    </div>
  );
}
