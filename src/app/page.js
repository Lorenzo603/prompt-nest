'use client';

import React from "react";
import PromptForm from "../components/PromptForm";
import PromptSearch from "../components/PromptSearch";

export default function Home() {
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🪺 PromptNest 🪺</h1>
      <PromptForm />
      <PromptSearch />
    </div>
  );
}
