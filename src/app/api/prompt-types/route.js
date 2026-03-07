import { NextResponse } from 'next/server';
import { getPromptTypes } from '@/server/promptTypes';

export async function GET() {
  try {
    const promptTypes = await getPromptTypes();
    return NextResponse.json(promptTypes);
  } catch (error) {
    console.error('Error fetching prompt types:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt types' }, { status: 500 });
  }
}
