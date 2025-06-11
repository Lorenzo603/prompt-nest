'use client';

import React, { useRef } from "react";
import CheckpointForm from "../../components/CheckpointForm";
import CheckpointSearch from "../../components/CheckpointSearch";
import Sidebar from "@/components/Sidebar";

export default function CheckpointsPage() {
  const checkpointSearchRef = useRef();

  const handleCheckpointAdded = () => {
    if (checkpointSearchRef.current) {
      checkpointSearchRef.current.refresh();
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-48 transition-all duration-300">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Checkpoints</h1>
          <CheckpointForm onCheckpointAdded={handleCheckpointAdded} />
          <CheckpointSearch ref={checkpointSearchRef} />
        </div>
      </main>
    </div>
  );
}
