'use client'

import Image from "next/image";
import React, { useState, useEffect } from "react";
import db from "../db";
import PromptForm from "../components/PromptForm";
import PromptList from "../components/PromptList";

export default function Home() {

    const [prompts, setPrompts] = useState([]);

    useEffect(() => {
        const fetchPrompts = async () => {
            const prompts = await db.select("prompt").from("prompts");
            setPrompts(prompts);
        };
        fetchPrompts();
    }, []);

    const handleAddPrompt = async (prompt) => {
        await db.insert("prompts").values({ prompt });
        setPrompts([...prompts, prompt]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Prompt App</h1>
            <PromptForm />
            <PromptList />
        </div>
    );

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

            </footer>
        </div>
    );
}
