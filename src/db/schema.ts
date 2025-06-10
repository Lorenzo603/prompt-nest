import { date, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const promptsTable = pgTable("prompts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: text().notNull(),
  creationDate: timestamp().notNull(),
  type: varchar({ length: 32 }), // e.g., 'code', 'image', 'audio', etc.
  tags: text().array().default([]), // optional list of tags
});