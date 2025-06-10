import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		user: process.env.POSTGRES_DB_USER,
		host: process.env.POSTGRES_DB_HOST,
		database: process.env.POSTGRES_DB_NAME,
		password: process.env.POSTGRES_DB_PASSWORD,
		port: parseInt(process.env.POSTGRES_DB_PORT),
		ssl: false, // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
	},
});

