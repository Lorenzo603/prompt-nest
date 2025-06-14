import 'dotenv/config';
import { desc } from "drizzle-orm";
import db from "../db";
import { checkpointsTable, tagsTable } from "../db/schema";
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

export const getCheckpoints = async () => {
  const checkpoints = await db.select().from(checkpointsTable).orderBy(desc(checkpointsTable.creationDate));
  return checkpoints;
};

export const addCheckpoint = async ({ name, description, filename, 
    urls, settings, baseModel, relatedModels, tags, version, uploadDate }) => {
  // Ensure tags exist in tagsTable and get their names
  let tagNames = Array.isArray(tags) ? tags : [];
  for (const tag of tagNames) {
    const existing = await db.select().from(tagsTable).where(eq(tagsTable.name, tag));
    if (existing.length === 0) {
      await db.insert(tagsTable).values({ name: tag });
    }
  }

  let urlList = Array.isArray(urls) ? urls : [];
  let relatedModelList = Array.isArray(relatedModels) ? relatedModels : [];
  const creationDate = new Date();
  const [inserted] = await db.insert(checkpointsTable).values({ 
    name: name, 
    description: description, 
    creationDate: creationDate,
    tags: tagNames,
    filename: filename,
    urls: urlList, 
    baseModel: baseModel,
    relatedModels: relatedModelList,
    settings: settings,
    version: version,
    uploadDate: uploadDate ? new Date(uploadDate) : null,
  }).returning();

  // Index in Typesense
  try {
    await typesenseClient.collections('promptnest_checkpoints').documents().create({
      id: inserted.id.toString(),
      name: inserted.name,
      description: inserted.description,
      creationDate: creationDate.toISOString(),
      tags: tagNames,
      filename: inserted.filename || '',
      urls: inserted.urls || [],
      settings: inserted.settings || '',
      baseModel: inserted.baseModel || '',
      relatedModels: inserted.relatedModels || [],
      version: inserted.version || '',
      uploadDate: inserted.uploadDate || '',
    });
  } catch (err) {
    console.error('Typesense indexing error:', err);
  }

  return { message: "Checkpoint added successfully" };
};

export const updateCheckpoint = async ({ id, name, description, filename, 
    urls, settings, baseModel, relatedModels, tags, version, uploadDate }) => {
  // Ensure tags exist in tagsTable and get their names
  let tagNames = Array.isArray(tags) ? tags : [];
  for (const tag of tagNames) {
    const existing = await db.select().from(tagsTable).where(eq(tagsTable.name, tag));
    if (existing.length === 0) {
      await db.insert(tagsTable).values({ name: tag });
    }
  }

  let urlList = Array.isArray(urls) ? urls : [];
  let relatedModelList = Array.isArray(relatedModels) ? relatedModels : [];
  
  const [updated] = await db.update(checkpointsTable)
    .set({ 
      name: name, 
      description: description, 
      tags: tagNames,
      filename: filename,
      urls: urlList, 
      baseModel: baseModel,
      relatedModels: relatedModelList,
      settings: settings,
      version: version,
      uploadDate: uploadDate ? new Date(uploadDate) : null,
    })
    .where(eq(checkpointsTable.id, id))
    .returning();

  // Update in Typesense
  try {
    await typesenseClient.collections('promptnest_checkpoints').documents(id.toString()).update({
      name: updated.name,
      description: updated.description,
      tags: tagNames,
      filename: updated.filename || '',
      urls: updated.urls || [],
      settings: updated.settings || '',
      baseModel: updated.baseModel || '',
      relatedModels: updated.relatedModels || [],
      version: updated.version || '',
      uploadDate: updated.uploadDate ? updated.uploadDate.toISOString() : '',
    });
  } catch (err) {
    console.error('Typesense update error:', err);
  }

  return { message: "Checkpoint updated successfully", checkpoint: updated };
};

export const deleteCheckpoint = async (id) => {
  // Get the checkpoint first to verify it exists
  const [checkpoint] = await db.select().from(checkpointsTable).where(eq(checkpointsTable.id, id));
  
  if (!checkpoint) {
    throw new Error('Checkpoint not found');
  }

  // Delete from database
  await db.delete(checkpointsTable).where(eq(checkpointsTable.id, id));

  // Delete from Typesense
  try {
    await typesenseClient.collections('promptnest_checkpoints').documents(id.toString()).delete();
  } catch (err) {
    console.error('Typesense delete error:', err);
  }

  return { message: "Checkpoint deleted successfully" };
};
