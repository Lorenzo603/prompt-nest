import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP and GIF files are allowed.' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename using timestamp and random number
    const fileExtension = path.extname(file.name);
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const uniqueFilename = `lora_${timestamp}_${randomNum}${fileExtension}`;
    
    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'dam', 'loras');
    await mkdir(uploadDir, { recursive: true });
    
    // Write file
    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);
    
    // Return the URL path that can be used to access the file
    const imageUrl = `/dam/loras/${uniqueFilename}`;
    
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
