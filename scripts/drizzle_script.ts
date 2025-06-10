import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { promptsTable } from '../src/db/schema';
import { Pool } from 'pg';

// Run with command:
// npx tsx scripts/drizzle_script.ts
//

const pool = new Pool({
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: parseInt(process.env.POSTGRES_DB_PORT),
});

const db = drizzle(pool);

async function main() {
  const prompt: typeof promptsTable.$inferInsert = {
    text: 'This is a prompt',
    creationDate: new Date().toISOString(),
  };

  await db.insert(promptsTable).values(prompt);
  console.log('New prompt created!')

  const prompts = await db.select().from(promptsTable);
  console.log('Getting all prompt from the database: ', prompts);
  /*
  const prompt: {
    id: number;
    text: string;
    creationdate: number;
  }[]
  */

//   await db
//     .update(usersTable)
//     .set({
//       age: 31,
//     })
//     .where(eq(usersTable.email, user.email));
//   console.log('User info updated!')

//   await db.delete(usersTable).where(eq(usersTable.email, user.email));
//   console.log('User deleted!')
}

main();
