"use client";

import React from "react";

const LoraCard = ({ lora }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-2 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">{lora.baseModel}</span>
                <span className="text-lg font-semibold text-gray-800">{lora.name}</span>
            </div>
            {lora.description && (
                <p className="text-gray-600 text-sm">{lora.description}</p>
            )}
            {lora.triggerWords && lora.triggerWords.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">Trigger words:</span>
                    {lora.triggerWords.map((word, index) => (
                        <span key={index} className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{word}</span>
                    ))}
                </div>
            )}
            {lora.filename && (
                <div className="text-sm text-gray-600">
                    <span className="font-medium">File:</span> {lora.filename}
                </div>
            )}
            <div className="flex justify-between items-center mt-2 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                    {lora.tags && lora.tags.length > 0 && lora.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                <span className="text-xs text-gray-500">{new Date(lora.creationDate).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default LoraCard;
