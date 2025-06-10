"use client";

import React from "react";

const PromptCard = ({ prompt }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-2 border border-gray-200">
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">{prompt.type}</span>
                <span className="text-lg font-semibold text-gray-800">{prompt.text}</span>
            </div>
            <div className="flex justify-between items-center mt-2 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                    {prompt.tags && prompt.tags.length > 0 && prompt.tags.map((tag) => (
                        <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                <span className="text-xs text-gray-500">{new Date(prompt.creationDate).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default PromptCard;
