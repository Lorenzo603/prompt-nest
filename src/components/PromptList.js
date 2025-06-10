"use client";

import React, { useState, useEffect } from "react";

const PromptList = React.forwardRef((props, ref) => {
    const [prompts, setPrompts] = useState([]);
    const [error, setError] = useState(null);

    const fetchPrompts = async () => {
        try {
            const response = await fetch("/api/prompts");
            const prompts = await response.json();
            setPrompts(prompts);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    React.useImperativeHandle(ref, () => ({
        refresh: fetchPrompts
    }));

    return (
        <ul>
            {prompts.map((prompt) => (
                <li key={prompt.id}>{prompt.text} - {prompt.creationDate}</li>
            ))}
            {error && <div style={{ color: "red" }}>{error}</div>}
        </ul>
    );
});

export default PromptList;