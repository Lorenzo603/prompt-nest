"use client";

import React, { useState } from "react";
import CheckpointEditModal from "./CheckpointEditModal";

const CheckpointCard = ({ checkpoint, onCheckpointUpdated }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col gap-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">{checkpoint.baseModel}</span>
                        <span className="text-lg font-semibold text-gray-800">{checkpoint.name}</span>
                        <span className="text-xs text-gray-400">#{checkpoint.id}</span>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer"
                    >
                        Edit
                    </button>
                </div>
            
            {checkpoint.description && (
                <p className="text-gray-600 text-sm">{checkpoint.description}</p>
            )}
            
            {checkpoint.filename && (
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Filename:</span> {checkpoint.filename}
                </div>
            )}
            
            {checkpoint.urls && checkpoint.urls.length > 0 && (
                <div className="text-sm">
                    <span className="font-medium text-gray-700">URLs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {checkpoint.urls.map((url, index) => (
                            <a 
                                key={index} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
                            >
                                {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            
            {checkpoint.relatedModels && checkpoint.relatedModels.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">Related:</span>
                    {checkpoint.relatedModels.map((model, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{model}</span>
                    ))}
                </div>
            )}
            
            {checkpoint.settings && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Settings:</span>
                    <pre className="text-xs mt-1 whitespace-pre-wrap">{checkpoint.settings}</pre>
                </div>
            )}
            
            <div className="flex justify-between items-center mt-2 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                    {checkpoint.tags && checkpoint.tags.length > 0 && checkpoint.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                <span className="text-xs text-gray-500">{new Date(checkpoint.creationDate).toLocaleString()}</span>
            </div>
            </div>
            
            {/* Edit Modal */}
            {isEditModalOpen && (
                <CheckpointEditModal
                    checkpoint={checkpoint}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={(updatedCheckpoint) => {
                        setIsEditModalOpen(false);
                        onCheckpointUpdated && onCheckpointUpdated(updatedCheckpoint);
                    }}
                />
            )}
        </>
    );
};

export default CheckpointCard;
