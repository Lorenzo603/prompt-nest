import 'dotenv/config';
import { asc, eq } from "drizzle-orm";
import db from "../db";
import { baseModelsTable } from "../db/schema";

const PREDEFINED_BASE_MODELS = [
  "SD1.5",
  "SDXL 1.0",
  "Pony",
  "Illustrious",
  "Flux.1 D",
  "Other",
];

const ensurePredefinedBaseModels = async () => {
  for (const modelName of PREDEFINED_BASE_MODELS) {
    const existing = await db
      .select({ id: baseModelsTable.id })
      .from(baseModelsTable)
      .where(eq(baseModelsTable.name, modelName))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(baseModelsTable).values({ name: modelName });
    }
  }
};

export const getBaseModels = async () => {
//   await ensurePredefinedBaseModels();

  return db
    .select()
    .from(baseModelsTable)
    .orderBy(asc(baseModelsTable.name));
};
