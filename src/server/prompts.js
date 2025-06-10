import { desc } from "drizzle-orm";
import db from "../db";
import { promptsTable } from "../db/schema";

export const getPrompts = async () => {
  const prompts = await db.select().from(promptsTable).orderBy(desc(promptsTable.creationDate));
  return prompts;
};

export const addPrompt = async (prompt) => {
  await db.insert(promptsTable).values({ text: prompt.text, creationDate: new Date(), type: prompt.type });
  return { message: "Prompt added successfully" };
};