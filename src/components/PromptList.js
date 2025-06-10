import React, { useState, useEffect } from "react";

const PromptList = () => {
    const [prompts, setPrompts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await fetch("/api/prompts");
                const prompts = await response.json();
                setPrompts(prompts);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchPrompts();
    }, []);

    return (
        <ul>
            {prompts.map((prompt, index) => (
                <li key={index}>{prompt}</li>
            ))}
            {error && <div style={{ color: "red" }}>{error}</div>}
        </ul>
    );
};

export default PromptList;