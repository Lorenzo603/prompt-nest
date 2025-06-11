"use client";

import React from "react";

const LoraCard = ({ lora }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">{lora.baseModel}</span>
                <span className="text-lg font-semibold text-gray-800">{lora.name}</span>
                <span className="text-xs text-gray-400">#{lora.id}</span>
            </div>
            
            {lora.description && (
                <p className="text-gray-600 text-sm">{lora.description}</p>
            )}
            
            {lora.filename && (
                <div className="text-sm text-gray-600">
                    <span className="font-medium">File:</span> {lora.filename}
                </div>
            )}
            
            {lora.triggerWords && lora.triggerWords.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">Trigger words:</span>
                    {lora.triggerWords.map((word, index) => (
                        <span key={index} className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{word}</span>
                    ))}
                </div>
            )}
            
            {lora.urls && lora.urls.length > 0 && (
                <div className="text-sm">
                    <span className="font-medium text-gray-700">URLs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {lora.urls.map((url, index) => (
                            <a 
                                key={index} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-purple-600 hover:text-purple-800 underline text-xs break-all"
                            >
                                {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            
            {lora.settings && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Settings:</span>
                    <pre className="text-xs mt-1 whitespace-pre-wrap">{lora.settings}</pre>
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
