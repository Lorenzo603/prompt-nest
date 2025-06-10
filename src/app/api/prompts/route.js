import { NextResponse } from 'next/server';
import { getPrompts, addPrompt } from '@/server/prompts';

export async function GET() {
  const prompts = await getPrompts();
  return NextResponse.json(prompts);
}

export async function POST(request) {
  const { prompt } = await request.json();
  const result = await addPrompt(prompt);
  return NextResponse.json(result, { status: 201 });
}
