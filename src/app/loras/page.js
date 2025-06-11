'use client';

import React, { useRef } from "react";
import LoraForm from "../../components/LoraForm";
import LoraSearch from "../../components/LoraSearch";
import Sidebar from "@/components/Sidebar";

export default function LorasPage() {
  const loraSearchRef = useRef();

  const handleLoraAdded = () => {
    if (loraSearchRef.current) {
      loraSearchRef.current.refresh();
    }
  };

  const handleLoraUpdated = () => {
    if (loraSearchRef.current) {
      loraSearchRef.current.refresh();
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-48 transition-all duration-300">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">🧬 Loras</h1>
          <LoraForm onLoraAdded={handleLoraAdded} />
          <LoraSearch ref={loraSearchRef} onLoraUpdated={handleLoraUpdated} />
        </div>
      </main>
    </div>
  );
}
