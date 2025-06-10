"use client";

import React, { useState } from "react";

const PromptForm = ({ onPromptAdded }) => {
    const [prompt, setPrompt] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!prompt.trim()) {
            setError("Prompt cannot be empty.");
            return;
        }
        try {
            const response = await fetch("/api/prompts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const result = await response.json();
            console.log(result);
            setPrompt(""); // Clear input on success
            setError(null);
            onPromptAdded();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
                <input
                    type="text"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Enter a prompt"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                    Add Prompt
                </button>
            </form>
            {error && <div className="text-red-500 w-full mt-2 text-sm">{error}</div>}
        </>
    );
};

export default PromptForm;