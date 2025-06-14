"use client";

import React, { useState } from "react";

const DEFAULT_LORA_BASE_MODEL = "SDXL"; // Default base model for the lora

const LoraForm = ({ onLoraAdded }) => {
    const [loraName, setLoraName] = useState("");
    const [loraDescription, setLoraDescription] = useState("");
    const [triggerWords, setTriggerWords] = useState("");
    const [tags, setTags] = useState("");
    const [baseModel, setBaseModel] = useState(DEFAULT_LORA_BASE_MODEL);
    const [filename, setFilename] = useState("");
    const [urls, setUrls] = useState("");
    const [settings, setSettings] = useState("");
    const [version, setVersion] = useState("");
    const [uploadDate, setUploadDate] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!loraName.trim()) {
            setError("Lora name cannot be empty.");
            return;
        }
        try {
            const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
            const triggerWordsList = triggerWords.split(",").map(t => t.trim()).filter(Boolean);
            const urlsList = urls.split(",").map(t => t.trim()).filter(Boolean);
            const response = await fetch(`/api/loras`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name: loraName, 
                    description: loraDescription, 
                    filename: filename, 
                    urls: urlsList, 
                    settings: settings,
                    baseModel: baseModel, 
                    tags: tagList,
                    version: version,
                    uploadDate: uploadDate,
                }),
            });
            const result = await response.json();
            console.log(result);
            setLoraName(""); // Clear input on success
            setLoraDescription("");
            setFilename("");
            setTriggerWords("");
            setUrls("");
            setBaseModel(DEFAULT_LORA_BASE_MODEL); // Reset base model to default
            setTags("");
            setVersion("");
            setUploadDate("");
            setError(null);
            onLoraAdded();
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
                            <select
                                value={baseModel}
                                onChange={e => setBaseModel(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50 sm:w-40"
                            >
                                <option value="SD1.5">SD1.5</option>
                                <option value="SDXL">SDXL</option>
                                <option value="SD2.1">SD2.1</option>
                                <option value="Flux">Flux</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="text"
                                value={loraName}
                                onChange={(event) => setLoraName(event.target.value)}
                                placeholder="Enter lora name"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                placeholder="Lora Version"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        <textarea
                            value={loraDescription}
                            onChange={(event) => setLoraDescription(event.target.value)}
                            placeholder="Enter lora description"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50 min-h-[60px] resize-y"
                            rows={2}
                        />
                        <input
                            type="text"
                            value={triggerWords}
                            onChange={e => setTriggerWords(e.target.value)}
                            placeholder="Trigger words (comma separated)"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={filename}
                                onChange={e => setFilename(e.target.value)}
                                placeholder="Filename (e.g., lora.safetensors)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                            />
                            <input
                                type="text"
                                value={uploadDate}
                                onChange={(e) => setUploadDate(e.target.value)}
                                placeholder="Upload Date (YYYY-MM-DD)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                            />
                        </div>
                        <input
                            type="text"
                            value={urls}
                            onChange={e => setUrls(e.target.value)}
                            placeholder="URLs (comma separated)"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                        />
                        <input
                            type="text"
                            value={settings}
                            onChange={(e) => setSettings(e.target.value)}
                            placeholder="Settings"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
                        />
                        <input
                            type="text"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            placeholder="Tags (comma separated)"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 bg-gray-50"
                        />
                        
                    </div>
                    <div className="flex">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors font-semibold cursor-pointer"
                        >
                            Add Lora
                        </button>
                    </div>
                </div>
            </form>
            {error && <div className="text-red-500 w-full mt-2 text-sm">{error}</div>}
        </>
    );
};

export default LoraForm;
