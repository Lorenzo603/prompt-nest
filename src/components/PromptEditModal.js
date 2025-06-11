"use client";

import React, { useState } from "react";

const PromptEditModal = ({ prompt, onClose, onSave }) => {
    const [text, setText] = useState(prompt.text || "");
    const [type, setType] = useState(prompt.type || "image");
    const [tags, setTags] = useState(prompt.tags ? prompt.tags.join(", ") : "");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!text.trim()) {
            setError("Prompt text cannot be empty.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
            
            const response = await fetch(`/api/prompts`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: prompt.id,
                    text: text,
                    type: type,
                    tags: tagList,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update prompt');
            }
            
            const result = await response.json();
            onSave(result.prompt);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Prompt</h2>
                    
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            >
                                <option value="code">Code</option>
                                <option value="image">Image</option>
                                <option value="audio">Audio</option>
                                <option value="writing">Writing</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prompt Text
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter prompt text"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50 min-h-[120px] resize-y"
                                rows={6}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. portrait, realistic, art"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        
                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex gap-3 justify-end pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PromptEditModal;
