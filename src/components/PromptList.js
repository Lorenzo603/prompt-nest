"use client";

import React, { useState, useEffect } from "react";

const PromptList = () => {
    const [prompts, setPrompts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await fetch("/api/prompts");
                const prompts = await response.json();
                console.log(prompts);
                setPrompts(prompts);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchPrompts();
    }, []);

    return (
        <ul>
            {prompts.map((prompt) => (
                <li key={prompt.id}>{prompt.text} - {prompt.creationDate}</li>
            ))}
            {error && <div style={{ color: "red" }}>{error}</div>}
        </ul>
    );
};

export default PromptList;