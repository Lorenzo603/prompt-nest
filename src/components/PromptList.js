"use client";

import React, { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

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
        <div className="flex flex-col gap-2 mt-4">
            {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
            ))}
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    );
});

export default PromptList;