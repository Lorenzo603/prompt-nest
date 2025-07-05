import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const promptStylesDir = path.join(process.cwd(), 'dam', 'prompt-styles');
    
    // Check if directory exists
    if (!fs.existsSync(promptStylesDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(promptStylesDir);
    
    // Filter for image files (excluding .json metadata files)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp', '.enc'].includes(ext) && !file.endsWith('.meta');
    });

    const promptStyles = [];

    for (const imageFile of imageFiles) {
      try {
        // Get the base filename without extension
        const baseName = path.parse(imageFile).name;
        
        // Look for corresponding JSON metadata file
        const jsonFile = `${baseName}.json`;
        const jsonPath = path.join(promptStylesDir, jsonFile);
        
        if (fs.existsSync(jsonPath)) {
          // Read and parse the JSON metadata
          const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
          const metadata = JSON.parse(jsonContent);
          
          // Create the prompt style object
          const promptStyle = {
            id: promptStyles.length + 1,
            title: metadata.title || baseName,
            prompt: metadata.prompt || '',
            imageUrl: `/api/static/dam/prompt-styles/${imageFile}`
          };
          
          promptStyles.push(promptStyle);
        } else {
          // If no JSON file exists, create a basic entry with just the filename
          const promptStyle = {
            id: promptStyles.length + 1,
            title: baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            prompt: '',
            imageUrl: `/api/static/dam/prompt-styles/${imageFile}`
          };
          
          promptStyles.push(promptStyle);
        }
      } catch (error) {
        console.error(`Error processing file ${imageFile}:`, error);
        // Continue with next file
      }
    }

    return NextResponse.json(promptStyles);
  } catch (error) {
    console.error('Error reading prompt styles:', error);
    return NextResponse.json({ error: 'Failed to load prompt styles' }, { status: 500 });
  }
}
