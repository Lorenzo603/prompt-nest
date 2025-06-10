import Image from "next/image";
import React from "react";
import PromptForm from "../components/PromptForm";
import PromptList from "../components/PromptList";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Prompt App</h1>
      <PromptForm />
      <PromptList />
    </div>
  );
}
