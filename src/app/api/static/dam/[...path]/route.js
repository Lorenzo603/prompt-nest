import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';

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

export async function GET(request, { params }) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join('/');
    const fullPath = path.join(process.cwd(), 'dam', filePath);
    
    // Security check: ensure the file is within the dam directory
    const damDir = path.join(process.cwd(), 'dam');
    const resolvedPath = path.resolve(fullPath);
    const resolvedDamDir = path.resolve(damDir);
    
    if (!resolvedPath.startsWith(resolvedDamDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Check if this is an encrypted file
    const isEncrypted = fullPath.endsWith('.enc');
    let fileBuffer, contentType;
    
    if (isEncrypted) {
      // Read encrypted file and decrypt it
      const encryptedBuffer = await readFile(fullPath);
      fileBuffer = decryptBuffer(encryptedBuffer);
      
      // Read metadata to get original content type
      const metadataPath = `${fullPath}.meta`;
      if (existsSync(metadataPath)) {
        const metadataContent = await readFile(metadataPath, 'utf8');
        const metadata = JSON.parse(metadataContent);
        contentType = metadata.mimeType;
      } else {
        // Fallback: try to determine content type from original extension
        const originalExtension = path.extname(fullPath.replace('.enc', '')).toLowerCase();
        contentType = getContentTypeFromExtension(originalExtension);
      }
    } else {
      // Non-encrypted file, read normally
      fileBuffer = await readFile(fullPath);
      const extension = path.extname(fullPath).toLowerCase();
      contentType = getContentTypeFromExtension(extension);
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving static file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getContentTypeFromExtension(extension) {
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}
