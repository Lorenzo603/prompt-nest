import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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
    
    // Read and return the file
    const fileBuffer = await readFile(fullPath);
    
    // Determine content type based on file extension
    const extension = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
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
