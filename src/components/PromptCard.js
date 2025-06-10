"use client";

import React from "react";

const PromptCard = ({ prompt }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-2 border border-gray-200">
            <div className="text-lg font-semibold text-gray-800">{prompt.text}</div>
            <div className="text-xs text-gray-500">{new Date(prompt.creationDate).toLocaleString()}</div>
        </div>
    );
};

export default PromptCard;
