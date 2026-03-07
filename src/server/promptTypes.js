import 'dotenv/config';
import { asc, eq } from "drizzle-orm";
import db from "../db";
import { promptTypesTable } from "../db/schema";

const PREDEFINED_PROMPT_TYPES = [
  "code",
  "image",
  "audio",
  "writing",
  "other",
];

const ensurePredefinedPromptTypes = async () => {
  for (const promptTypeName of PREDEFINED_PROMPT_TYPES) {
    const existing = await db
      .select({ id: promptTypesTable.id })
      .from(promptTypesTable)
      .where(eq(promptTypesTable.name, promptTypeName))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(promptTypesTable).values({ name: promptTypeName });
    }
  }
};

export const getPromptTypes = async () => {
//   await ensurePredefinedPromptTypes();

  return db
    .select()
    .from(promptTypesTable)
    .orderBy(asc(promptTypesTable.name));
};
