import db from "../db";

export const getPrompts = async () => {
    const prompts = await db.select("prompt").from("prompts");
    return prompts;
};

export const addPrompt = async (prompt) => {
    await db.insert("prompts").values({ prompt });
    return { message: "Prompt added successfully" };
};