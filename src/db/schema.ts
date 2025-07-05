import { date, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const promptsTable = pgTable("prompts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: text().notNull(),
  creationDate: timestamp().notNull(),
  type: varchar({ length: 32 }), // e.g., 'code', 'image', 'audio', etc.
  tags: text().array().default([]), // optional list of tags
});

export const tagsTable = pgTable("tags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 64 }).notNull().unique(),
});

export const checkpointsTable = pgTable("checkpoints", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 128 }).notNull(),
  description: text(),
  creationDate: timestamp().notNull(),
  tags: text().array().default([]),
  filename: text(), // e.g., 'model.safetensors'
  urls: text().array().default([]), 
  baseModel: text(), // e.g., 'gpt-3.5-turbo'
  relatedModels: text().array().default([]), // e.g. parent checkpoint or loras
  settings: text(), // recommended model settings
  publishedDate: timestamp(),
  version: text(),
  hash: text(), // file hash for integrity verification
});

export const lorasTable = pgTable("loras", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 128 }).notNull(),
  description: text(),
  creationDate: timestamp().notNull(),
  tags: text().array().default([]),
  filename: text(), // e.g., 'lora.safetensors'
  triggerWords: text().array().default([]), // e.g., ['cat', 'dog']
  urls: text().array().default([]),
  settings: text(), // recommended model settings
  baseModel: text(), // parent checkpoint
  publishedDate: timestamp(),
  version: text(),
  hash: text(), // file hash for integrity verification
  imageUrl: text(), // URL to uploaded image
});

