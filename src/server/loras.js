import 'dotenv/config';
import { desc } from "drizzle-orm";
import db from "../db";
import { lorasTable, tagsTable } from "../db/schema";
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

export const getLoras = async () => {
  const loras = await db.select().from(lorasTable).orderBy(desc(lorasTable.creationDate));
  return loras;
};

export const addLora = async ({ name, description, filename, triggerWords, urls, settings, baseModel, tags }) => {
  // Ensure tags exist in tagsTable and get their names
  let tagNames = Array.isArray(tags) ? tags : [];
  for (const tag of tagNames) {
    const existing = await db.select().from(tagsTable).where(eq(tagsTable.name, tag));
    if (existing.length === 0) {
      await db.insert(tagsTable).values({ name: tag });
    }
  }
  
  const creationDate = new Date();
  const triggerWordsList = Array.isArray(triggerWords) ? triggerWords : [];
  const urlsList = Array.isArray(urls) ? urls : [];
  
  const [inserted] = await db.insert(lorasTable).values({ 
    name: name, 
    description: description, 
    creationDate: creationDate,
    tags: tagNames, 
    filename: filename, 
    triggerWords: triggerWordsList, 
    urls: urlsList, 
    settings: settings || {},
    baseModel: baseModel, 
  }).returning();

  // Index in Typesense
  try {
    await typesenseClient.collections('promptnest_loras').documents().create({
      id: inserted.id.toString(),
      name: inserted.name,
      description: inserted.description,
      triggerWords: triggerWordsList,
      creationDate: creationDate.toISOString(),
      baseModel: inserted.baseModel,
      filename: inserted.filename,
      urls: inserted.urls || [],
      settings: inserted.settings || {},
      tags: tagNames,
    });
  } catch (err) {
    console.error('Typesense indexing error:', err);
  }

  return { message: "Lora added successfully" };
};
