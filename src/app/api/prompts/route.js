import { NextResponse } from 'next/server';
import { getPrompts, addPrompt, updatePrompt, deletePrompt } from '@/server/prompts';

export async function GET() {
  const prompts = await getPrompts();
  return NextResponse.json(prompts);
}

export async function POST(request) {
  const { text, type, tags } = await request.json();
  const result = await addPrompt({ text, type, tags });
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request) {
  try {
    const { id, text, type, tags } = await request.json();
    const result = await updatePrompt({ id, text, type, tags });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const result = await deletePrompt(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
