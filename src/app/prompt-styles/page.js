'use client';

import React from "react";
import Sidebar from "../../components/Sidebar";

export default function PromptStylesPage() {


  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-48 transition-all duration-300">
        <div className="flex flex-row gap-6 p-4">
          <section className="flex-1">
            <h1 className="text-3xl font-bold text-slate-100">Prompt Styles</h1>
            
          </section>
        </div>
      </main>
    </div>
  );
}
