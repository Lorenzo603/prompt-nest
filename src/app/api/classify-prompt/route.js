import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, useOllama = false } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    // Choose between test implementation and Ollama implementation
    const classification = useOllama 
      ? await classifyPromptWithOllama(prompt)
      : await classifyPromptTest(prompt);

    return NextResponse.json({ classification });
  } catch (error) {
    console.error('Error classifying prompt:', error);
    return NextResponse.json(
      { error: 'Failed to classify prompt' },
      { status: 500 }
    );
  }
}

// Test implementation - rule-based classifier for testing
async function classifyPromptTest(prompt) {
  // Mock implementation - rule-based classifier for testing
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

// Ollama implementation - calls Ollama API for actual LLM classification
async function classifyPromptWithOllama(prompt) {
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

You must respond with ONLY a valid JSON object with the following structure:
{
  "part text 1": ["Category1", "Category2"],
  "part text 2": ["Category3"],
  "part text 3": ["Category4", "Category5"]
}

Where each key is a part of the prompt text, and each value is an array of categories that apply to that part.

Example input: "A majestic dragon in a mystical forest with soft moonlight"
Example output:
{
  "A majestic dragon": ["Subject"],
  "mystical forest": ["Environment", "Mood"],
  "soft moonlight": ["Lighting", "Mood"]
}

Important: Respond ONLY with the JSON object, no other text.`;

  try {
    // Call Ollama API
    const response = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'llama3.2',
        prompt: `${systemPrompt}\n\nPrompt to classify: "${prompt}"`,
        stream: false,
        temperature: 0.3,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const ollamaResponse = data.response;

    console.log('Ollama response:', ollamaResponse);

    // Parse the JSON response from Ollama
    let parsedResponse;
    try {
      // Clean up the response in case there's extra text
      const jsonMatch = ollamaResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(ollamaResponse);
      }
      console.log('Parsed Ollama response:', parsedResponse);
    } catch (parseError) {
      console.error('Failed to parse Ollama response:', ollamaResponse);
      throw new Error('Invalid JSON response from Ollama');
    }

    // Validate the response structure
    if (!parsedResponse || typeof parsedResponse !== 'object') {
      throw new Error('Invalid response structure from Ollama');
    }

    // Convert the new key-value structure to the expected format
    const classification = Object.entries(parsedResponse).map(([text, categories], index) => ({
      text: text,
      categories: Array.isArray(categories) ? categories : ['Description'],
      confidence: 85 + Math.random() * 10 // Random confidence between 85-95% for LLM results
    }));

    console.log('Converted classification:', classification);

    return classification;

  } catch (error) {
    console.error('Error calling Ollama API:', error);
    // Fallback to test implementation if Ollama fails
    console.log('Falling back to test implementation');
    return await classifyPromptTest(prompt);
  }
}

// Legacy example code - kept for reference
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
