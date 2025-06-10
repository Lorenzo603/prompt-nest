import { date, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const promptsTable = pgTable("prompts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: text().notNull(),
  creationDate: timestamp().notNull(),
});