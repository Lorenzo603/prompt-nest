"use client";

import React, { useState } from "react";
import TagInput from "./TagInput";


const CheckpointForm = ({ onCheckpointAdded }) => {
    const [name, setName] = useState("");
    const [version, setVersion] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [filename, setFilename] = useState("");
    const [urls, setUrls] = useState("");
    const [baseModel, setBaseModel] = useState("");
    const [relatedModels, setRelatedModels] = useState("");
    const [settings, setSettings] = useState("");
    const [publishedDate, setPublishedDate] = useState("");
    const [hash, setHash] = useState("");

    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim()) {
            setError("Checkpoint name cannot be empty.");
            return;
        }
        try {
            const tagList = tags; // tags is already an array
            const urlList = urls.split(",").map(u => u.trim()).filter(Boolean);
            const relatedModelList = relatedModels.split(",").map(r => r.trim()).filter(Boolean);
            const response = await fetch("/api/checkpoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name: name, 
                    description: description, 
                    filename: filename, 
                    urls: urlList, 
                    settings: settings,
                    baseModel: baseModel, 
                    relatedModels: relatedModelList,
                    tags: tagList,
                    version: version,
                    publishedDate: publishedDate,
                    hash: hash,
                 }),
            });
            const result = await response.json();
            console.log(result);
            setName(""); // Clear input on success
            setDescription("");
            setFilename("");
            setUrls("");
            setSettings("");
            setBaseModel("");
            setRelatedModels("");
            setTags([]);
            setVersion("");
            setPublishedDate("");
            setHash("");
            setError(null);
            onCheckpointAdded();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Checkpoint Name"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                placeholder="Checkpoint Version"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={baseModel}
                                onChange={(e) => setBaseModel(e.target.value)}
                                placeholder="Base Model"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="Filename (e.g., model.safetensors)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={relatedModels}
                                onChange={(e) => setRelatedModels(e.target.value)}
                                placeholder="Related Models (comma separated)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={urls}
                                onChange={(e) => setUrls(e.target.value)}
                                placeholder="URLs (comma separated)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={publishedDate}
                                onChange={(e) => setPublishedDate(e.target.value)}
                                placeholder="Published Date (YYYY-MM-DD)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        <textarea
                            value={settings}
                            onChange={(e) => setSettings(e.target.value)}
                            placeholder="Settings"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                        />
                        <input
                            type="text"
                            value={hash}
                            onChange={(e) => setHash(e.target.value)}
                            placeholder="File Hash (SHA256, MD5, etc.)"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 bg-gray-50"
                        />
                        
                        <TagInput
                            value={tags}
                            onChange={setTags}
                            placeholder="Add tags..."
                            className="w-full"
                            ringColor="green"
                        />
                    </div>
                    <div className="flex">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
                        >
                            Add Checkpoint
                        </button>
                    </div>
                </div>
            </form>
            {error && <div className="text-red-500 w-full mt-2 text-sm">{error}</div>}
        </>
    );
};

export default CheckpointForm;