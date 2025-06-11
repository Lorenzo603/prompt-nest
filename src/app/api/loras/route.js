import { NextResponse } from 'next/server';
import { getLoras, addLora } from '@/server/loras';

export async function GET() {
  const loras = await getLoras();
  return NextResponse.json(loras);
}

export async function POST(request) {
  const { name, description, filename, triggerWords, urls, settings, baseModel, tags } = await request.json();
  const result = await addLora({ name, description, filename, triggerWords, urls, settings, baseModel, tags });
  return NextResponse.json(result, { status: 201 });
}
