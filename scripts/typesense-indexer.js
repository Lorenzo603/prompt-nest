
require('dotenv').config();
const { Client } = require('pg'); // PostgreSQL client
const Typesense = require('typesense'); // Typesense client

class TypesenseManager {
    constructor(typesenseClient, postgresConfig) {
        this.typesenseClient = typesenseClient;
        this.postgresConfig = postgresConfig;
    }

    async reindexCollection(collectionName, tableName) {
        let client;
        try {
            // Connect to PostgreSQL database
            client = new Client(this.postgresConfig);
            await client.connect();

            // Fetch all documents from the specified table
            const query = `SELECT id, name, description, "triggerWords", "baseModel", filename, urls, settings, tags, version, "publishedDate", hash FROM ${tableName}`;
            const result = await client.query(query);

            const documents = result.rows;

            // Re-index each document in the Typesense collection
            for (const doc of documents) {
                const {
                    id,
                    name,
                    description,
                    triggerWords,
                    baseModel,
                    filename,
                    urls,
                    settings,
                    tags,
                    version,
                    publishedDate,
                    hash,
                } = doc;

                // Prepare the document payload
                const payload = {
                    name: name,
                    description: description,
                    triggerWords: triggerWords ? triggerWords : [],
                    baseModel: baseModel,
                    filename: filename || '',
                    urls: urls ? urls : [],
                    settings: settings || '',
                    tags: tags ? tags : [],
                    version: version || '',
                    publishedDate: publishedDate ? new Date(publishedDate).toISOString() : '',
                    hash: hash || '',
                };

                // Update the document in Typesense
                await this.typesenseClient.collections(collectionName).documents(String(id)).update(payload);
            }

            console.log(`Successfully re-indexed all documents in the '${collectionName}' collection.`);
        } catch (error) {
            console.error(`Error during re-indexing: ${error.message}`);
        } finally {
            // Close the database connection
            if (client) {
                await client.end();
            }
        }
    }
}

const typesenseClient = new Typesense.Client({
    nodes: [
        {
            host: process.env.TYPESENSE_HOST || 'localhost',
            port: process.env.TYPESENSE_PORT || 8108,
            protocol: process.env.TYPESENSE_PROTOCOL || 'http',
        },
    ],
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
});

const postgresConfig = {
    user: process.env.POSTGRES_DB_USER,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: process.env.POSTGRES_DB_PORT,
};

const manager = new TypesenseManager(typesenseClient, postgresConfig);

// Re-index the 'promptnest_loras' collection from the 'loras' table
manager.reindexCollection('promptnest_loras', 'loras');