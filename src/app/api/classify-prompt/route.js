import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    // For now, we'll use a mock classification
    // In production, this would call your LLM API (e.g., via reverse tunnel)
    const classification = await classifyPrompt(prompt);

    return NextResponse.json({ classification });
  } catch (error) {
    console.error('Error classifying prompt:', error);
    return NextResponse.json(
      { error: 'Failed to classify prompt' },
      { status: 500 }
    );
  }
}

async function classifyPrompt(prompt) {
  // Mock implementation - replace with actual LLM API call
  // This would typically call your LLM via reverse tunnel
  
  // For demonstration, we'll create a simple rule-based classifier
  const parts = [];

  // Style-related terms
  const styleTerms = ['painting', 'photo', 'digital art', 'watercolor', 'oil painting', 'sketch', 'realistic', '3d', 'cartoon', 'anime'];
  const subjectTerms = ['person', 'woman', 'man', 'child', 'dragon', 'cat', 'dog', 'tree', 'flower', 'building', 'car'];
  const lightingTerms = ['soft light', 'harsh light', 'moonlight', 'sunlight', 'neon', 'candlelight', 'dramatic lighting', 'ambient'];
  const environmentTerms = ['forest', 'city', 'beach', 'mountains', 'indoor', 'outdoor', 'space', 'underwater'];
  const colorTerms = ['vibrant', 'muted', 'dark', 'bright', 'pastel', 'monochrome', 'colorful'];
  const moodTerms = ['peaceful', 'dramatic', 'mysterious', 'cheerful', 'somber', 'energetic'];

  // Split by dots and commas for better prompt segmentation
  const parts_raw = prompt.split(/[.,]+/).map(part => part.trim()).filter(part => part.length > 0);
  
  if (parts_raw.length === 0) {
    parts_raw.push(prompt);
  }

  parts_raw.forEach((part, index) => {
    const categories = [];
    let confidence = 70 + Math.random() * 25; // Random confidence between 70-95%

    // Check for style terms
    if (styleTerms.some(term => part.toLowerCase().includes(term))) {
      categories.push('Style');
    }

    // Check for subject terms
    if (subjectTerms.some(term => part.toLowerCase().includes(term))) {
      categories.push('Subject');
    }

    // Check for lighting terms
    if (lightingTerms.some(term => part.toLowerCase().includes(term))) {
      categories.push('Lighting');
    }

    // Check for environment terms
    if (environmentTerms.some(term => part.toLowerCase().includes(term))) {
      categories.push('Environment');
    }

    // Check for color terms
    if (colorTerms.some(term => part.toLowerCase().includes(term))) {
      categories.push('Color');
    }

    // Check for mood terms
    if (moodTerms.some(term => part.toLowerCase().includes(term))) {
      categories.push('Mood');
    }

    // Default categorization if no specific terms found
    if (categories.length === 0) {
      if (index === 0) {
        categories.push('Subject');
      } else {
        categories.push('Description');
      }
    }

    parts.push({
      text: part.trim(),
      categories: categories,
      confidence: Math.round(confidence)
    });
  });

  return parts;
}

// TODO: Replace the mock classifyPrompt function with actual LLM API call
// Example of how you might call an LLM:
/*
async function classifyPromptWithLLM(prompt) {
  const systemPrompt = `You are a prompt classifier for AI image generation. 
  Break down the given prompt into distinct parts and categorize each part.
  
  Categories include:
  - Style (art style, medium, technique)
  - Subject (main subject, objects, characters)
  - Lighting (lighting conditions, mood lighting)
  - Environment (setting, location, background)
  - Color (color schemes, color descriptions)
  - Perspective (camera angle, point of view)
  - Mood (emotional tone, atmosphere)
  - Composition (layout, framing)
  - Technique (photography techniques, artistic methods)
  
  Return a JSON array where each object has:
  - text: the part of the prompt
  - categories: array of applicable categories
  - confidence: confidence score (0-100)
  
  Example input: "A majestic dragon in a mystical forest with soft moonlight"
  Example output: [
    {"text": "A majestic dragon", "categories": ["Subject"], "confidence": 95},
    {"text": "mystical forest", "categories": ["Environment", "Mood"], "confidence": 90},
    {"text": "soft moonlight", "categories": ["Lighting", "Mood"], "confidence": 88}
  ]`;

  // Call your LLM API here (e.g., via reverse tunnel to llama3.2)
  const response = await fetch('YOUR_LLM_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: systemPrompt,
      user: prompt,
      temperature: 0.3
    })
  });

  const result = await response.json();
  return JSON.parse(result.content);
}
*/
