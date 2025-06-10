import { date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const promptsTable = pgTable("prompts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: text().notNull(),
  creationDate: date().notNull(),
});