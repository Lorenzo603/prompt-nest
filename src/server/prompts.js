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
    //   path: process.env.TYPESENSE_PATH || '/typesense',
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  connectionTimeoutSeconds: 2,
});

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
  const creationDate = new Date();
  const [inserted] = await db.insert(promptsTable).values({ text, type, tags: tagNames, creationDate }).returning();

  // Index in Typesense
  try {
    await typesenseClient.collections('prompts').documents().create({
      id: inserted.id.toString(),
      text: text,
      creationDate: creationDate.toISOString(),
      type: type,
      tags: tagNames,
    });
  } catch (err) {
    console.error('Typesense indexing error:', err);
  }

  return { message: "Prompt added successfully" };
};