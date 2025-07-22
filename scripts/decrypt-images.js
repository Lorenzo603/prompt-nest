const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Encryption configuration
const ENCRYPTION_KEY = process.env.IMAGE_ENCRYPTION_KEY || 'your-32-character-secret-key-here!'; // 32 characters
const ALGORITHM = 'aes-256-cbc';

function decryptBuffer(encryptedBuffer) {
    const iv = encryptedBuffer.slice(0, 16);
    const encrypted = encryptedBuffer.slice(16);
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted;
}

function decryptFiles(folderPath) {
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && filePath.endsWith('.enc')) {
            const encryptedBuffer = fs.readFileSync(filePath);
            const decryptedBuffer = decryptBuffer(encryptedBuffer);
            const decryptedFilePath = filePath.replace('.enc', '');
            fs.writeFileSync(decryptedFilePath, decryptedBuffer);
            console.log(`Decrypted file: ${filePath} -> ${decryptedFilePath}`);
        }
    });
}

// Usage
if (process.argv.length !== 3) {
    console.error('Usage: node decrypt-files.js <folder-path>');
    process.exit(1);
}

const folderPath = process.argv[2];
decryptFiles(folderPath);