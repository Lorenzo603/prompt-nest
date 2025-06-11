"use client";

import React, { useState } from "react";

const DEFAULT_PROMPT_TYPE = "image"; // Default type for the prompt

const PromptForm = ({ onPromptAdded }) => {
    const [promptText, setPromptText] = useState("");
    const [promptType, setPromptType] = useState(DEFAULT_PROMPT_TYPE);
    const [tags, setTags] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!promptText.trim()) {
            setError("Prompt cannot be empty.");
            return;
        }
        try {
            const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
            const response = await fetch("/api/prompts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: promptText, type: promptType, tags: tagList }),
            });
            const result = await response.json();
            console.log(result);
            setPromptText(""); // Clear input on success
            setPromptType(DEFAULT_PROMPT_TYPE); // Reset type to default
            setTags("");
            setError(null);
            onPromptAdded();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <select
                        value={promptType}
                        onChange={e => setPromptType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50 sm:w-40"
                    >
                        <option value="code">Code</option>
                        <option value="image">Image</option>
                        <option value="audio">Audio</option>
                        <option value="other">Other</option>
                    </select>
                    <textarea
                        value={promptText}
                        onChange={(event) => setPromptText(event.target.value)}
                        placeholder="Enter a prompt"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50 min-h-[60px] resize-y"
                        rows={3}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
                    >
                        Add Prompt
                    </button>
                </div>
                <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50 w-full"
                />
            </form>
            {error && <div className="text-red-500 w-full mt-2 text-sm">{error}</div>}
        </>
    );
};

export default PromptForm;