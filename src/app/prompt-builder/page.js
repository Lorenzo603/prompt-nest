'use client';

import React, { useRef } from "react";
import Sidebar from "../../components/Sidebar";
import PromptClassifier from "@/components/PromptBuilder/PromptClassifier";
import PromptBuilder from "@/components/PromptBuilder/PromptBuilder";

export default function PromptBuilderPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-48 transition-all duration-300">
        <div className="flex flex-row gap-6 p-4">
          <section className="flex-1">
            <PromptClassifier />
          </section>
          <section className="flex-1">
            <PromptBuilder />
          </section>
        </div>
      </main>
    </div>
  );
}


// Classifier section:
// input: prompt
// output: classification of each part of the prompt
// --> calls llama3.2 running via reverse tunnel

// Builder section:
// input: input form for each category, with suggestions for each category
// output: prompt



// //--- USEFUL PROMPTS ----//
// Inpainting object removal: empty, blur, soft, background

// Prompt template / questions:
// - style (photo, painting, pixel art)
// - subject (person, animal, landscape)
// - lighting (soft, ambient, ring light, neon, sun rays)
// - environment (indoor, outdoor, underwater, in space)
// - color scheme (vibrant, dark, pastel)
// - point of view (front, overhead, side)
// - background (solid color, nebula, forest)
// - specific style (3D, studio ghibli, poster)
// - specific photo type (macro, telephoto, go pro)

