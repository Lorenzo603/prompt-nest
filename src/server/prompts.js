import { desc } from "drizzle-orm";
import db from "../db";
import { promptsTable, tagsTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const getPrompts = async () => {
  const prompts = await db.select().from(promptsTable).orderBy(desc(promptsTable.creationDate));
  return prompts;
};

export const addPrompt = async ({ text, type, tags }) => {
  // Ensure tags exist in tagsTable and get their names
  let tagNames = Array.isArray(tags) ? tags : [];
  for (const tag of tagNames) {
    const existing = await db.select().from(tagsTable).where(eq(tagsTable.name, tag));
    if (existing.length === 0) {
      await db.insert(tagsTable).values({ name: tag });
    }
  }
  await db.insert(promptsTable).values({ text, type, tags: tagNames, creationDate: new Date() });
  return { message: "Prompt added successfully" };
};