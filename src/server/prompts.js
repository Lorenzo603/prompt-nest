import db from "../db";
import { promptsTable } from "../db/schema";

export const getPrompts = async () => {
  const prompts = await db.select().from(promptsTable);
  return prompts;
};

export const addPrompt = async (prompt) => {
  await db.insert(promptsTable).values({ text: prompt, creationDate: new Date() });
  return { message: "Prompt added successfully" };
};