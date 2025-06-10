"use client";

import React, { useState } from "react";

const PromptForm = () => {
    const [prompt, setPrompt] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/prompts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Enter a prompt"
            />
            <button type="submit">Add Prompt</button>
            {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
    );
};

export default PromptForm;