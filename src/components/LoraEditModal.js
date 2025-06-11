"use client";

import React, { useState } from "react";

const LoraEditModal = ({ lora, onClose, onSave }) => {
    const [name, setName] = useState(lora.name || "");
    const [description, setDescription] = useState(lora.description || "");
    const [tags, setTags] = useState(lora.tags ? lora.tags.join(", ") : "");
    const [filename, setFilename] = useState(lora.filename || "");
    const [urls, setUrls] = useState(lora.urls ? lora.urls.join(", ") : "");
    const [baseModel, setBaseModel] = useState(lora.baseModel || "");
    const [triggerWords, setTriggerWords] = useState(lora.triggerWords ? lora.triggerWords.join(", ") : "");
    const [settings, setSettings] = useState(lora.settings ? JSON.stringify(lora.settings, null, 2) : "");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Lora name cannot be empty.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
            const urlList = urls.split(",").map(u => u.trim()).filter(Boolean);
            const triggerWordList = triggerWords.split(",").map(t => t.trim()).filter(Boolean);
            
            let parsedSettings = {};
            if (settings.trim()) {
                try {
                    parsedSettings = JSON.parse(settings);
                } catch (e) {
                    setError("Invalid JSON format in settings.");
                    setIsLoading(false);
                    return;
                }
            }
            
            const response = await fetch(`/api/loras`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: lora.id,
                    name: name, 
                    description: description, 
                    filename: filename, 
                    urls: urlList, 
                    settings: parsedSettings,
                    baseModel: baseModel, 
                    triggerWords: triggerWordList,
                    tags: tagList,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update lora');
            }
            
            const result = await response.json();
            console.log(result);
            onSave({
                ...lora,
                name,
                description,
                filename,
                urls: urlList,
                settings: parsedSettings,
                baseModel,
                triggerWords: triggerWordList,
                tags: tagList,
            });
        } catch (error) {
            console.error('Update error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Lora</h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Lora Name"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={baseModel}
                                onChange={(e) => setBaseModel(e.target.value)}
                                placeholder="Base Model"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="Filename (e.g., lora.safetensors)"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={urls}
                                onChange={(e) => setUrls(e.target.value)}
                                placeholder="URLs (comma separated)"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        
                        <input
                            type="text"
                            value={triggerWords}
                            onChange={(e) => setTriggerWords(e.target.value)}
                            placeholder="Trigger Words (comma separated)"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                        />
                        
                        <textarea
                            value={settings}
                            onChange={(e) => setSettings(e.target.value)}
                            placeholder="Settings (JSON format)"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50 font-mono text-sm"
                        />
                        
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Tags (comma separated)"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                        />
                    </div>
                    
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    
                    <div className="flex gap-3 mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoraEditModal;
