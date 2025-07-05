import 'dotenv/config';
import { desc } from "drizzle-orm";
import db from "../db";
import { promptsTable, tagsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import Typesense from 'typesense';


const typesenseClient = new Typesense.Client({
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY || 'typesense_admin_api_key',
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: process.env.TYPESENSE_PORT ? Number(process.env.TYPESENSE_PORT) : 8108,
      path: process.env.TYPESENSE_PATH || '',
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  connectionTimeoutSeconds: 2,
});

export const getPrompts = async () => {
  const prompts = await db.select().from(promptsTable).orderBy(desc(promptsTable.creationDate));
  return prompts;
};

export const addPrompt = async ({ text, type, tags, imageUrl }) => {
  // Ensure tags exist in tagsTable and get their names
  let tagNames = Array.isArray(tags) ? tags : [];
  for (const tag of tagNames) {
    const existing = await db.select().from(tagsTable).where(eq(tagsTable.name, tag));
    if (existing.length === 0) {
      await db.insert(tagsTable).values({ name: tag });
    }
  }
  const creationDate = new Date();
  const [inserted] = await db.insert(promptsTable).values({ text, type, tags: tagNames, creationDate, imageUrl }).returning();

  // Index in Typesense
  try {
    await typesenseClient.collections('promptnest_prompts').documents().create({
      id: inserted.id.toString(),
      text: text,
      creationDate: creationDate.toISOString(),
      type: type,
      tags: tagNames,
      imageUrl: imageUrl || '',
    });
  } catch (err) {
    console.error('Typesense indexing error:', err);
  }

  return { message: "Prompt added successfully" };
};

export const updatePrompt = async ({ id, text, type, tags, imageUrl }) => {
  // Ensure tags exist in tagsTable and get their names
  let tagNames = Array.isArray(tags) ? tags : [];
  for (const tag of tagNames) {
    const existing = await db.select().from(tagsTable).where(eq(tagsTable.name, tag));
    if (existing.length === 0) {
      await db.insert(tagsTable).values({ name: tag });
    }
  }
  
  const [updated] = await db.update(promptsTable)
    .set({ 
      text: text, 
      type: type, 
      tags: tagNames,
      imageUrl: imageUrl,
    })
    .where(eq(promptsTable.id, id))
    .returning();

  // Update in Typesense
  try {
    await typesenseClient.collections('promptnest_prompts').documents(id.toString()).update({
      text: updated.text,
      type: updated.type,
      tags: tagNames,
      imageUrl: updated.imageUrl || '',
    });
  } catch (err) {
    console.error('Typesense update error:', err);
  }

  return { message: "Prompt updated successfully", prompt: updated };
};

export const deletePrompt = async (id) => {
  // Get the prompt first to verify it exists
  const [prompt] = await db.select().from(promptsTable).where(eq(promptsTable.id, id));
  
  if (!prompt) {
    throw new Error('Prompt not found');
  }

  // Delete from database
  await db.delete(promptsTable).where(eq(promptsTable.id, id));

  // Delete from Typesense
  try {
    await typesenseClient.collections('promptnest_prompts').documents(id.toString()).delete();
  } catch (err) {
    console.error('Typesense delete error:', err);
  }

  return { message: "Prompt deleted successfully" };
};