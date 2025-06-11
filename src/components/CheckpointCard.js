"use client";

import React from "react";

const CheckpointCard = ({ checkpoint }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-2 border border-gray-200">
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">{checkpoint.description}</span>
                <span className="text-lg font-semibold text-gray-800">{checkpoint.name}</span>
            </div>
            <div className="flex justify-between items-center mt-2 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                    {checkpoint.tags && checkpoint.tags.length > 0 && checkpoint.tags.map((tag) => (
                        <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                <span className="text-xs text-gray-500">{new Date(checkpoint.creationDate).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default CheckpointCard;
