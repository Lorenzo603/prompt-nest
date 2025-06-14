"use client";

import React, { useState } from "react";
import TagInput from "./TagInput";

const CheckpointEditModal = ({ checkpoint, onClose, onSave }) => {
    const [name, setName] = useState(checkpoint.name || "");
    const [description, setDescription] = useState(checkpoint.description || "");
    const [tags, setTags] = useState(checkpoint.tags || []);
    const [filename, setFilename] = useState(checkpoint.filename || "");
    const [urls, setUrls] = useState(checkpoint.urls ? checkpoint.urls.join(", ") : "");
    const [baseModel, setBaseModel] = useState(checkpoint.baseModel || "");
    const [relatedModels, setRelatedModels] = useState(checkpoint.relatedModels ? checkpoint.relatedModels.join(", ") : "");
    const [settings, setSettings] = useState(checkpoint.settings || "");
    const [version, setVersion] = useState(checkpoint.version || "");
    const [uploadDate, setUploadDate] = useState(checkpoint.uploadDate || "");
    const [hash, setHash] = useState(checkpoint.hash || "");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Checkpoint name cannot be empty.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const tagList = tags; // tags is already an array
            const urlList = urls.split(",").map(u => u.trim()).filter(Boolean);
            const relatedModelList = relatedModels.split(",").map(r => r.trim()).filter(Boolean);
            
            const response = await fetch(`/api/checkpoints`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: checkpoint.id,
                    name: name, 
                    description: description, 
                    filename: filename, 
                    urls: urlList, 
                    settings: settings,
                    baseModel: baseModel, 
                    relatedModels: relatedModelList,
                    tags: tagList,
                    version: version,
                    uploadDate: uploadDate,
                    hash: hash,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update checkpoint');
            }
            
            const result = await response.json();
            console.log(result);
            onSave({
                ...checkpoint,
                name,
                description,
                filename,
                urls: urlList,
                settings: settings,
                baseModel,
                relatedModels: relatedModelList,
                tags: tagList,
                version,
                uploadDate,
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Checkpoint</h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Checkpoint Name"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                placeholder="Checkpoint Version"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={baseModel}
                                onChange={(e) => setBaseModel(e.target.value)}
                                placeholder="Base Model"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="Filename (e.g., model.safetensors)"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={relatedModels}
                                onChange={(e) => setRelatedModels(e.target.value)}
                                placeholder="Related Models (comma separated)"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                            />
                            
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={urls}
                                onChange={(e) => setUrls(e.target.value)}
                                placeholder="URLs (comma separated)"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                            />
                                <input
                                type="text"
                                value={uploadDate}
                                onChange={(e) => setUploadDate(e.target.value)}
                                placeholder="Upload Date (YYYY-MM-DD)"
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                            />
                        </div>

                        <textarea
                            value={settings}
                            onChange={(e) => setSettings(e.target.value)}
                            placeholder="Settings"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50 font-mono text-sm"
                        />
                        
                        <input
                            type="text"
                            value={hash}
                            onChange={(e) => setHash(e.target.value)}
                            placeholder="File Hash (SHA256, MD5, etc.)"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                        />
                        
                        <TagInput
                            value={tags}
                            onChange={setTags}
                            placeholder="Add tags..."
                            className="w-full"
                            ringColor="green"
                        />
                    </div>
                    
                    
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    
                    <div className="flex gap-3 mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckpointEditModal;
